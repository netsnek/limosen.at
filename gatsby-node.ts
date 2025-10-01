import { PageConfig } from 'jaen';
import { GatsbyNode } from 'gatsby';
import path from 'path';
import fs from 'fs';
import { buildSearchIndex } from './src/utils/search/build-search-index';

/** ----- i18n translation-removal + Jaen recreation config ----- */
const DEFAULT_LOCALE = 'en-US';
/** These are the locale URL prefixes you configured in gatsby-plugin-i18n-l10n */
const LOCALE_PREFIXES = ['en', 'de', 'tr', 'ar'];
/** Remove *translations* for these URL roots (and all their children) */
const URL_BLACKLIST = ['/cms/', '/login/', '/mailpress/', '/settings/', '/logout/'];

/** Normalize path to have leading slash, no duplicate slashes */
const normalizePath = (p: string) => {
  if (!p) return '/';
  let s = p.trim();
  if (!s.startsWith('/')) s = '/' + s;
  // collapse multiple slashes
  s = s.replace(/\/{2,}/g, '/');
  return s;
};

/** Strip any known locale prefix like /de or /tr from the start of the path */
const stripLocalePrefix = (p: string) => {
  const norm = normalizePath(p);
  // build regex like ^/(en|de|tr|ar)(/|$)
  const re = new RegExp(`^/(?:${LOCALE_PREFIXES.join('|')})(?=/|$)`, 'i');
  const stripped = norm.replace(re, '');
  return stripped || '/';
};

/** True if path is under any blacklisted URL root (exact or child) */
const isUnderBlacklistedRoot = (p: string) => {
  const norm = normalizePath(p);
  // drop trailing slash for compare
  const trimmed = norm.replace(/\/+$/, '');
  return URL_BLACKLIST.some(root => {
    const r = normalizePath(root).replace(/\/+$/, '');
    return trimmed === r || trimmed.startsWith(r + '/');
  });
};

const detectLocaleFromPath = (p: string): string | undefined => {
  const norm = normalizePath(p);
  const seg = norm.split('/')[1]; // first segment after leading slash
  return LOCALE_PREFIXES.includes(seg) ? seg : undefined;
};

/** Try to detect locale from page.context or from URL */
const getPageLocale = (page: any): string | undefined => {
  const ctx = page?.context ?? {};
  return (
    ctx.locale ??
    ctx.language ??
    ctx.lang ??
    ctx?.i18n?.locale ??
    ctx?.intl?.locale ??
    ctx?.intl?.language ??
    detectLocaleFromPath(page.path)
  );
};

/** ----------------------------------------------------- */

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@/clients': path.resolve(__dirname, 'src/clients')
      }
    }
  });
};

/**
 * Goal:
 * - Recreate every *non-blacklisted* page (default + translated) as a Jaen page so metadata is editable per locale.
 * - For blacklisted URL roots, keep default locale and remove translations.
 * - Use a per-locale stable Jaen id: `path:<path-without-locale>::<locale>`
 * - Avoid infinite loops with `__jaenRecreated`.
 */
export const onCreatePage: GatsbyNode['onCreatePage'] = async ({ page, actions }) => {
  const { deletePage, createPage } = actions;

  // Prevent infinite reprocessing
  if ((page.context as any)?.__jaenRecreated) {
    return;
  }

  const locale = getPageLocale(page) || DEFAULT_LOCALE;
  const isTranslated = locale !== DEFAULT_LOCALE;

  // figure out the effective "base" path without locale prefix
  const pathNoLocale = stripLocalePrefix(page.path);
  const matchNoLocale = page.matchPath ? stripLocalePrefix(page.matchPath) : undefined;

  const isBlacklisted =
    isUnderBlacklistedRoot(pathNoLocale) ||
    (matchNoLocale && isUnderBlacklistedRoot(matchNoLocale));

  // 1) Blacklisted: keep default, remove translations; don't recreate
  if (isBlacklisted) {
    if (isTranslated) {
      deletePage(page);
    }
    return;
  }

  // 2) Not blacklisted: recreate **every** locale (default + translated) as a Jaen page
  // Per-locale Jaen id so each locale has its own editable metadata
  const stableJaenId = `path:${pathNoLocale}::${locale}`;

  // Recreate with augmented context for Jaen
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      __jaenRecreated: true,
      locale,
      // Jaen identifiers; keep both keys for compatibility
      jaenPageId: stableJaenId,
      jaenId: stableJaenId,
      // useful helper if you need to map back to base path in components
      originalPath: pathNoLocale,
      ...(matchNoLocale ? { matchPathNoLocale: matchNoLocale } : {})
    }
  });
};

export const onPostBuild: GatsbyNode['onPostBuild'] = async ({
  graphql,
  reporter
}) => {
  const result = await graphql<{
    allJaenPage: {
      nodes: Array<{
        id: string;
        slug: string;
        parentPage: {
          id: string;
        } | null;
        template: string | null;
        jaenPageMetadata: {
          title: string;
        };
        jaenFields: Record<string, any> | null;
        pageConfig: PageConfig | null;
        buildPath: string;
        sections: Array<{
          items: Array<{
            jaenFields: Record<string, any>;
            sections: Array<{
              items: Array<{
                jaenFields: Record<string, any>;
              }>;
            }>;
          }>;
        }>;
      }>;
    };
  }>(`
    query {
      allJaenPage {
        nodes {
          id
          slug
          parentPage {
            id
          }
          template
          jaenPageMetadata {
            title
          }
          jaenFields
          pageConfig
          buildPath
          sections {
            items {
              jaenFields
              sections {
                items {
                  jaenFields
                }
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild(
      `Error while running GraphQL query. ${result.errors}`
    );
    return;
  }

  const { allJaenPage } = result.data;

  await preparePagesAndBuildSearch(allJaenPage);
};

async function preparePagesAndBuildSearch(allJaenPage: {
  nodes: Array<{
    id: string;
    slug: string;
    parentPage: {
      id: string;
    } | null;
    template: string | null;
    jaenPageMetadata: {
      title: string;
    };
    jaenFields: Record<string, any> | null;
    pageConfig: PageConfig | null;
    buildPath: string;
    sections: Array<{
      items: Array<{
        jaenFields: Record<string, any>;
        sections: Array<{
          items: Array<{
            jaenFields: Record<string, any>;
          }>;
        }>;
      }>;
    }>;
  }>;
}) {
  const nodesForSearchIndex = allJaenPage.nodes.map(node => {
    const originPath = node.buildPath;

    let type = node.template;
    if (type && path.extname(type)) {
      type = path.basename(type, path.extname(type));
    }

    return {
      id: node.id,
      path: originPath,
      jaenPageMetadata: node.jaenPageMetadata,
      jaenFields: node.jaenFields,
      type
    };
  });

  const searchIndex = await buildSearchIndex(nodesForSearchIndex as any);

  await fs.promises.writeFile(
    path.join('public', 'search-index.json'),
    JSON.stringify(searchIndex)
  );
}

import { PageConfig } from 'jaen';
import { GatsbyNode } from 'gatsby';
import path from 'path';
import fs from 'fs';
import { buildSearchIndex } from './src/utils/search/build-search-index';

/**
 * The patch history delivers JaenPage entries whose `sections` is null, and the
 * source plugin only heals that for pages a stateful route still backs. One
 * malformed node then fails every query that selects JaenPage.sections, because
 * the field is declared non-null through the schema customization API, and the
 * build dies in parallel query running rather than at the node itself.
 *
 * Defaulting the resolver keeps the non-null contract without touching the data.
 * The sibling site carries the identical workaround for the identical reason.
 */
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ actions, schema }) => {
    actions.createTypes(
      schema.buildObjectType({
        name: 'JaenPage',
        fields: {
          sections: {
            type: '[JaenSection!]!',
            resolve: (source: { sections?: unknown }) =>
              Array.isArray(source.sections) ? source.sections : []
          }
        }
      })
    );
  };

/**
 * The jaen packages come in as yarn `link:` deps, so webpack resolves them
 * through their real path and looks for THEIR dependencies in the monorepo tree
 * rather than in this one. Two consequences, and the first one is fatal:
 *
 *   1. Anything the linked package needs that the monorepo does not carry cannot
 *      be found at all. That is what `gqty` is: it is declared here and installed
 *      here, and the emailwerk client that imports it lives over there, so the
 *      build died on "Can't resolve 'gqty'".
 *   2. Anything both trees carry is resolved twice, which for a library that
 *      keeps identity in module scope means two instances. React, emotion,
 *      Chakra and next-themes all break that way, and next-themes breaks
 *      invisibly: it carries the colour mode in a React context, so two copies
 *      mean two providers and a toggle that moves one subtree.
 *
 * Aliasing every one of them to this repo's own copy is what the sibling site
 * does, for the same reason and with the same list. The versions are identical,
 * so this only collapses duplicates, it does not change what runs.
 */
export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions
}) => {
  const own = (name: string) => path.resolve(__dirname, 'node_modules', name);

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@/clients': path.resolve(__dirname, 'src/clients'),
        ...Object.fromEntries(
          [
            'react',
            'react-dom',
            '@emotion/react',
            '@chakra-ui/react',
            'next-themes',
            // The gqty stack and graphql: the emailwerk and iam clients are
            // instantiated inside the linked packages and read from here.
            'gqty',
            '@gqty/react',
            'use-sync-external-store',
            'graphql',
            // CodeMirror keeps language identity in facets, and a facet from one
            // copy is not the facet the other copy reads. Two copies means the
            // editor silently ignores every extension handed to it.
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/language',
            '@lezer/common',
            '@lezer/highlight',
            '@lezer/lr',
            '@lezer/javascript',
            '@lezer/css',
            '@lezer/html',
            '@lezer/markdown',
            '@lezer/xml'
          ].map(name => [name, own(name)])
        ),
        // acorn is one copy in two formats: its exports map offers acorn.mjs to
        // `import` and acorn.js to `require`, and the MDX runtime reaches it from
        // both sides, so it ships twice. The exact-match alias collapses both
        // onto the ESM build, which is the direction that holds: webpack lets
        // CommonJS require an ES module and hands back the namespace.
        acorn$: path.resolve(__dirname, 'node_modules/acorn/dist/acorn.mjs')
      }
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

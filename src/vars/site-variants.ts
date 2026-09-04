/**
 * The two brands this one source tree serves.
 *
 * limosen.at is canonical and booklimo is derived from it. That is a rule about
 * how the site is maintained, and this file is what makes it true in the code:
 * there is ONE gatsby-config, and everything that differs between the brands is
 * listed here, once.
 *
 * It replaces gatsby-config-booklimo.ts, a second copy of the whole config that
 * had drifted badly by the time anyone looked: it still declared the pre-v3
 * `zitadel` option and loaded gatsby-jaen-mailpress, a package this tree no
 * longer has, so it could not build at all. A variant that is a copy stops being
 * a variant the moment the original moves.
 *
 * Select with SITE_VARIANT=booklimo. Without it the build is limosen.
 */
export type SiteVariant = 'limosen' | 'booklimo'

export interface SiteVariantConfig {
  /** The brand's public origin, without a trailing slash. */
  siteUrl: string
  /** Where the CMS publishes to. Only used by the Publish button, never at build time. */
  repository: string
  /** The Zitadel organization that owns this brand's users. */
  organizationId: string
  /**
   * Where Zitadel sends the browser after a login. It must match a redirect URI
   * registered on the OIDC client, so it cannot be chosen freely here, and
   * src/pages/loading.tsx exists to receive it.
   */
  redirectUri: string
  /** The app area's own backend. */
  appPylonUrl: string
  /** Relative to the project root, handed to gatsby-plugin-manifest. */
  icon: string
}

export const VARIANTS: Record<SiteVariant, SiteVariantConfig> = {
  limosen: {
    siteUrl: 'https://limosen.at',
    repository: 'netsnek/limosen.at',
    organizationId: '339284789469124181',
    redirectUri: 'https://limosen.at/loading',
    appPylonUrl: 'https://api.limosen.at/graphql',
    icon: 'src/favicon.ico'
  },
  booklimo: {
    siteUrl: 'https://new.booklimo.at',
    // The repository does not exist on GitHub yet. Publishing from the CMS fires
    // a repository_dispatch at it, so until it does, this brand's CMS can read
    // and edit but not publish. Building is unaffected.
    repository: 'netsnek/booklimo.at',
    // The organization is named "krc" in Zitadel and Login V1 already refuses
    // members of the other organization, so the user bases are separate today.
    organizationId: '356348844407002709',
    redirectUri: 'https://new.booklimo.at/loading',
    // The config this replaces pointed at booklimo.netsnek.workers.dev, which
    // answers 404. This one answers.
    appPylonUrl: 'https://api.booklimo.at/graphql',
    icon: 'src/favicon-booklimo.ico'
  }
}

export const ACTIVE_VARIANT: SiteVariant =
  process.env.SITE_VARIANT === 'booklimo' ? 'booklimo' : 'limosen'

export const SITE = VARIANTS[ACTIVE_VARIANT]

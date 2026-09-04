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
  /** The legal name, as it appears in the footer and in the About copy. */
  companyName: string
  /** The name the page title and the structured data lead with. */
  brandName: string
  contactEmail: string
  contactPhone: string
  /** The same number as contactPhone, without spaces, for a tel: href. */
  contactPhoneTel: string
  /** Where the "Follow us" links point. Empty is allowed. */
  socialLinks: Array<{label: string; href: string}>
}

export const VARIANTS: Record<SiteVariant, SiteVariantConfig> = {
  limosen: {
    siteUrl: 'https://limosen.at',
    repository: 'netsnek/limosen.at',
    organizationId: '339284789469124181',
    redirectUri: 'https://limosen.at/loading',
    appPylonUrl: 'https://api.limosen.at/graphql',
    icon: 'src/favicon.ico',
    companyName: 'LIMOSEN KG',
    brandName: 'Limosen',
    contactEmail: 'office@limosen.at',
    contactPhone: '+43 660 876 06 06',
    contactPhoneTel: '+436608760606',
    socialLinks: [
      {label: 'Instagram', href: 'https://www.instagram.com/limosen.at'}
    ]
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
    icon: 'src/favicon-booklimo.ico',
    // Taken from the company's own site at www.krclimo.at rather than invented.
    // Everything the visitor can see has to be this brand's: the phone number
    // and the mail address on the booklimo pages were limosen's, which sent
    // this brand's enquiries to the wrong company.
    companyName: 'KRC Limousinenservice KG',
    brandName: 'KRC Limousinenservice',
    contactEmail: 'office@krclimo.at',
    contactPhone: '+43 699 109 983 52',
    contactPhoneTel: '+4369910998352',
    // No account is published for this brand, so the block stays out rather
    // than pointing at the other company's Instagram.
    socialLinks: []
  }
}

/**
 * GATSBY_SITE_VARIANT first, and that order is the whole point.
 *
 * SITE_VARIANT is a build-time variable: Gatsby inlines GATSBY_ prefixed ones
 * into the browser bundle and nothing else, so in the browser SITE_VARIANT is
 * undefined and this fell back to limosen. Server rendering saw booklimo and
 * the client saw limosen, so a booklimo page painted the right contact details
 * and then hydration replaced them with the other company's. That is what a
 * visitor saw as the mail address flickering from KRC's to limosen's.
 *
 * gatsby-config mirrors SITE_VARIANT into GATSBY_SITE_VARIANT before anything
 * else runs, so both halves now read the same value.
 */
export const ACTIVE_VARIANT: SiteVariant =
  (process.env.GATSBY_SITE_VARIANT || process.env.SITE_VARIANT) === 'booklimo'
    ? 'booklimo'
    : 'limosen'

export const SITE = VARIANTS[ACTIVE_VARIANT]

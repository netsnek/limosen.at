/**
 * This brand's values, in one place.
 *
 * The file used to hold two records and a `SITE_VARIANT` switch, because one
 * source tree served both limosen.at and booklimo.at. It does not any more:
 * the other brand lives in `netsnek/booklimo.at` with its own copy of this
 * file, and the two are maintained separately. Nothing here may describe it.
 *
 * That separation is not tidiness. The switch produced a defect that a visitor
 * could see: `ACTIVE_VARIANT` read `process.env.SITE_VARIANT`, and Gatsby
 * inlines only `GATSBY_` prefixed variables into the browser bundle, so server
 * rendering resolved to one brand and hydration to the other. The contact mail
 * address changed under the reader a moment after the page appeared. A constant
 * cannot do that, and this is a constant.
 */
export interface SiteConfig {
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
  /**
   * The company's Google Business entry, in the form that opens the review
   * dialog straight away. The profile page leaves the visitor to find the
   * rating control; this puts them into the writing view, which is the point
   * of the button.
   */
  googleReviewUrl: string
}

export const SITE: SiteConfig = {
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
  ],
  /*
    The place id of the listing that GOOGLE_MAPS_OPEN points at (Google now
    titles it "LIMOSEN Luxury Limousine & Chauffeur Service"), read off the
    Maps page on 2026-09-05. Unlike a g.page/r/ short link it needs no
    Business Profile share code, and search.google.com's writereview
    endpoint opens the same dialog.
  */
  googleReviewUrl:
    'https://search.google.com/local/writereview?placeid=ChIJ6VnYQO-rbUcRxW1IL2qo7rU'
}

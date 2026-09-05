// src/vars/i18n.tsx
import { getI18nHomepage } from './i18nHomepage'
import { getI18nContact } from './i18nContact'
import { getI18nBooking } from './i18nBooking'
import { getI18nTransfers } from './i18nTransfers'
// A relative path through node_modules, not the package name: gatsby-config.ts
// imports this catalogue, and gatsby compiles that file with Parcel, which
// bundles relative imports and leaves a package import as a require() that
// node cannot load from a .ts source. The link resolves to the jaen checkout.
import { getI18nJaen } from '../../../node_modules/gatsby-plugin-jaen/src/locales/i18nJaen'

export type I18nCode = 'en-US' | 'de-AT' | 'tr-TR' | 'ar-EG'

export interface UnifiedI18n {
  code: I18nCode
  // Flat messages consumed by <IntlProvider messages={...}>
  // Includes merged string keys + every other top-level field from homepage/contact/booking.
  messages: Record<string, any>
}

const strip = <T extends Record<string, any>>(obj: T, keys: string[]) => {
  const out: Record<string, any> = {}
  for (const k in obj) if (!keys.includes(k)) out[k] = obj[k]
  return out
}

/**
 * Collect everything from homepage.*, contact.*, booking.* into one flat `messages` object.
 * - Merges all `*.strings` into top-level id:value pairs
 * - Adds all other top-level fields generically (no hardcoded sub-keys)
 *
 * This file shadows gatsby-plugin-jaen's own `locales/i18n.ts`, and with it
 * the catalogue the frame, the settings page and the whole CMS read through
 * react-intl. Until 2026-09-05 it carried the site's strings only, so every
 * jaen key fell back to its English defaultMessage: the avatar drawer said
 * Settings and Logout beside a German page, whatever the account or the
 * browser said. jaen's catalogue is spread first and the site's strings over
 * it, so a key both carry stays the site's.
 */
export function getI18n(code: I18nCode): UnifiedI18n {
  const jaen = getI18nJaen(code)
  const homepage = getI18nHomepage(code)
  const contact = getI18nContact(code)
  const booking = getI18nBooking(code)
  const transfers = getI18nTransfers(code)

  const messages: Record<string, any> = {
    // jaen's CMS strings first, so the frame speaks the account's language
    ...(jaen?.strings ?? {}),
    // then the site's flat string IDs, which win on a shared key
    ...(homepage?.strings ?? {}),
    ...(contact?.strings ?? {}),
    ...(booking?.strings ?? {}),
    ...(transfers?.strings ?? {}),

    // then all other top-level fields (no hardcoding), excluding `code` and `strings`
    ...strip(homepage || {}, ['code', 'strings']),
    ...strip(contact || {}, ['code', 'strings']),
    ...strip(booking || {}, ['code', 'strings']),
    ...strip(transfers|| {}, ['code', 'strings'])
  }

  return {
    code,
    messages
  }
}

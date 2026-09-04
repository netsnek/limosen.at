import React from 'react'
import type {PageProps} from 'gatsby'
import {navigate} from 'gatsby'
import {PageConfig} from 'jaen'

/**
 * The OIDC redirect target, restored into the site.
 *
 * Zitadel sends the browser back to the `redirectUri` registered on the OIDC
 * client, and for both variants that is `/loading`. The old jaen shipped this
 * page itself; the version this site now links against does not, so after the
 * migration a successful login landed on a 404 and the session was dropped.
 * Changing the redirect instead would mean changing the registration in Zitadel,
 * which is not ours to change.
 *
 * The behaviour is the old page's, verbatim: an installed PWA goes on to the app
 * dashboard, a normal browser goes to the start page. That is what the live site
 * does today, and the manifest's `start_url: /login` depends on it.
 */
const isPwa = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const mediaQuery = window.matchMedia?.('(display-mode: standalone)')

  return Boolean(mediaQuery?.matches || (window.navigator as any)?.standalone)
}

const LoadingPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    navigate(isPwa() ? '/app/dashboard/' : '/', {replace: true})
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-black rounded-full animate-spin" />
    </div>
  )
}

export default LoadingPage

export const pageConfig: PageConfig = {
  label: 'Loading',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'

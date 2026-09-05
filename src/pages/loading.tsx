import React from 'react'
import type {PageProps} from 'gatsby'
import {navigate} from 'gatsby'
import {Box, Center, Stack, Text} from '@chakra-ui/react'
import {PageConfig, useAuth} from 'jaen'

import {Logo} from '../gatsby-plugin-jaen/components/Logo'

/**
 * The OIDC redirect target.
 *
 * Zitadel sends the browser back to the `redirectUri` registered on the OIDC
 * client, which is this path, and the page's job is to send the visitor on:
 * an installed PWA goes to the app dashboard, a normal browser to the start
 * page. The manifest's `start_url: /login` depends on that.
 *
 * What the visitor sees meanwhile is the logo, centred, and one short line
 * under it that changes every moment and says what is going on: the sign-in
 * is being completed, the session set up, the app loaded. No footer, no
 * spinner. The page used to render inside jaen's content layout with the
 * imprint and privacy footer under a spinner, and on a phone that footer was
 * the most visible thing for the second the page is up: a visitor who has
 * just signed in and sees legal links assumes the login failed. The lines
 * exist so the wait reads as progress and not as a crash, which is why the
 * page stays for a moment even when the redirect could happen at once.
 *
 * It has to wait before it leaves, and that is the subtlety of this file.
 * Zitadel arrives here with `?code=&state=`, and jaen's OIDC runtime sits
 * behind a `React.lazy` import, so it mounts a chunk request later than this
 * page does. Navigating away in the first effect, which this page once did,
 * strips the query before the provider ever sees it: nobody is signed in,
 * `/app/dashboard` is gated and sends the visitor to `/login`, `/login`
 * starts a new sign-in, Zitadel still has the session and answers at once,
 * and the browser is back here with a fresh code. An endless login loop that
 * never shows an error. So while a code is in the url the page does nothing;
 * the provider clears it in `onSigninCallback`, the auth state changes, and
 * that re-runs the effect. A failed exchange goes to the start page, not the
 * dashboard, because the dashboard would restart the same loop, and a
 * fifteen second timeout makes sure nothing waits here forever.
 *
 * The page carries the colour mode of the app, not the website's forced
 * light (gatsby-plugin-jaen's color-mode-scope), so a dark brand does not
 * flash white between the login and the dashboard.
 */
const isPwa = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const mediaQuery = window.matchMedia?.('(display-mode: standalone)')

  return Boolean(mediaQuery?.matches || (window.navigator as any)?.standalone)
}

/** The lines, in the order they appear. German first, like every product string. */
const LINES: Record<'de' | 'en' | 'tr' | 'ar', string[]> = {
  de: [
    'Anmeldung wird abgeschlossen',
    'Sitzung wird eingerichtet',
    'App wird geladen',
    'Gleich geht es los'
  ],
  en: [
    'Completing your sign-in',
    'Setting up your session',
    'Loading the app',
    'Almost there'
  ],
  tr: [
    'Giriş tamamlanıyor',
    'Oturum hazırlanıyor',
    'Uygulama yükleniyor',
    'Neredeyse hazır'
  ],
  ar: [
    'جارٍ إكمال تسجيل الدخول',
    'جارٍ إعداد الجلسة',
    'جارٍ تحميل التطبيق',
    'أوشكنا على الانتهاء'
  ]
}

/** The browser's language, reduced to the four the sites speak. German otherwise. */
const language = (): keyof typeof LINES => {
  if (typeof navigator === 'undefined') return 'de'
  const code = (navigator.language || '').toLowerCase().slice(0, 2)
  return code === 'en' || code === 'tr' || code === 'ar' ? code : 'de'
}

/** True while the provider still has an authorization response to exchange. */
const hasPendingResponse = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const params = new URLSearchParams(window.location.search)

  return (
    (params.has('code') && params.has('state')) ||
    (params.has('error') && params.has('state'))
  )
}

/** How long one line stays, the least time the page stays, and the most. */
const LINE_MS = 1400
const MIN_STAY_MS = 2 * LINE_MS
const GIVE_UP_MS = 15000

const LoadingPage: React.FC<PageProps> = () => {
  const auth = useAuth()
  const [lang, setLang] = React.useState<keyof typeof LINES>('de')
  const [index, setIndex] = React.useState(0)
  const [stayedEnough, setStayedEnough] = React.useState(false)
  const [gaveUp, setGaveUp] = React.useState(false)

  React.useEffect(() => {
    setLang(language())
    const ticker = window.setInterval(() => {
      setIndex(i => (i + 1) % LINES.de.length)
    }, LINE_MS)
    const stay = window.setTimeout(() => setStayedEnough(true), MIN_STAY_MS)
    const giveUp = window.setTimeout(() => setGaveUp(true), GIVE_UP_MS)
    return () => {
      window.clearInterval(ticker)
      window.clearTimeout(stay)
      window.clearTimeout(giveUp)
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!gaveUp) {
      if (hasPendingResponse() || auth.isLoading || !stayedEnough) {
        return
      }
    }

    navigate(auth.isAuthenticated && isPwa() ? '/app/dashboard/' : '/', {
      replace: true
    })
  }, [auth.isAuthenticated, auth.isLoading, stayedEnough, gaveUp])

  const lines = LINES[lang]

  return (
    <Center minH="100dvh" bg="bg" px="8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Stack align="center" gap="10">
        <Logo width="min(60vw, 16rem)" height="auto" />
        {/* key on the index so every line mounts afresh and replays the pop. */}
        <Box
          key={index}
          css={{
            '@keyframes loading-pop': {
              from: {opacity: 0, transform: 'translateY(0.5rem) scale(0.94)'},
              '60%': {opacity: 1, transform: 'translateY(0) scale(1.03)'},
              to: {opacity: 1, transform: 'translateY(0) scale(1)'}
            },
            animation: 'loading-pop 520ms cubic-bezier(0.22, 1, 0.36, 1) both'
          }}>
          <Text
            textStyle="lg"
            fontWeight="medium"
            color="fg.muted"
            textAlign="center"
            aria-live="polite">
            {lines[index]}
            <Text as="span" aria-hidden="true">
              …
            </Text>
          </Text>
        </Box>
      </Stack>
    </Center>
  )
}

export default LoadingPage

export const pageConfig: PageConfig = {
  label: 'Loading',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'bare'
  }
}

export {Head} from 'jaen'

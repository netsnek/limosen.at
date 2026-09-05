import React from 'react'
import type {PageProps} from 'gatsby'
import {navigate} from 'gatsby'
import {Center, Spinner, Stack} from '@chakra-ui/react'
import {PageConfig} from 'jaen'

import {Logo} from '../gatsby-plugin-jaen/components/Logo'

/**
 * The OIDC redirect target.
 *
 * Zitadel sends the browser back to the `redirectUri` registered on the OIDC
 * client, which is this path, and the page's only job is to send the visitor
 * on: an installed PWA goes to the app dashboard, a normal browser to the
 * start page. The manifest's `start_url: /login` depends on that.
 *
 * What it shows meanwhile is the logo and a spinner, nothing else. It used to
 * render inside jaen's content layout, which puts the imprint, privacy and
 * terms footer under every page, and on a phone that footer was the most
 * visible thing on the screen for the second the page is up. A visitor who
 * has just signed in and sees legal links instead of the app assumes the login
 * failed. The `bare` layout type exists for this page.
 *
 * The page carries the colour mode of the app, not the website's forced light
 * (see gatsby-plugin-jaen's color-mode-scope), so on a dark brand there is no
 * white flash between the login and the dashboard.
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
    <Center minH="100dvh" bg="bg" px="8">
      <Stack align="center" gap="8">
        <Logo width="min(60vw, 16rem)" height="auto" />
        <Spinner size="lg" colorPalette="brand" color="colorPalette.solid" borderWidth="3px" />
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

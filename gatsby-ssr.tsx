import React from 'react';
import type { GatsbySSR } from 'gatsby';

import './src/styles/global.css';

/**
 * The viewport tag, which src/html.js deliberately no longer carries.
 *
 * Gatsby's template hardcodes `width=device-width, initial-scale=1,
 * shrink-to-fit=no`, leaving viewport-fit at its default. On iOS that makes
 * every env(safe-area-inset-*) resolve to 0, so a layout has no way to know
 * where the home indicator is. The app's bottom navigation is fixed to
 * bottom 0, and in the installed PWA it therefore drew underneath the swipe-up
 * line on an iPhone 15 Pro Max.
 *
 * `viewport-fit=cover` turns those insets into real numbers, and app.css pads
 * the navigation by the bottom one.
 *
 * It is added for /app only, deliberately. The same flag also lets a document
 * paint into the safe areas, which for the marketing pages would mean sections
 * reaching under the indicator in portrait and under the notch in landscape.
 * Those pages must keep rendering exactly as they do, and they lose nothing:
 * they have no fixed bottom element.
 */
export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  pathname,
  setHeadComponents
}) => {
  const isApp = pathname?.startsWith('/app');

  setHeadComponents([
    <meta
      key="viewport"
      name="viewport"
      content={
        isApp
          ? 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
          : 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    />
  ]);
};

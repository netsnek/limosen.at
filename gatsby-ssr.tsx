import React from 'react';
import type { GatsbySSR } from 'gatsby';

import './src/styles/global.css';

/**
 * Gatsby's default viewport tag is `width=device-width, initial-scale=1,
 * shrink-to-fit=no`, which leaves `viewport-fit` at its default. On iOS that
 * makes every `env(safe-area-inset-*)` resolve to 0, so a layout has no way to
 * know where the home indicator is. The app's bottom navigation is
 * `position: fixed; bottom: 0`, and in the installed PWA that put it underneath
 * the swipe-up line on an iPhone 15 Pro Max.
 *
 * `viewport-fit=cover` turns those insets into real numbers, and the navigation
 * pads itself by the inset in app.css.
 *
 * It is applied to /app/ only, deliberately. The same flag also lets a document
 * paint into the safe areas, which for the marketing pages would mean sections
 * reaching under the indicator in portrait and under the notch in landscape.
 * Those pages must keep rendering exactly as they do, so they keep the default
 * viewport and lose nothing: they have no fixed bottom element.
 *
 * replaceHeadComponents rather than setHeadComponents, because Gatsby has
 * already put its own viewport tag in the list and two of them would leave the
 * winner to document order.
 */
export const onPreRenderHTML: GatsbySSR['onPreRenderHTML'] = ({
  pathname,
  getHeadComponents,
  replaceHeadComponents
}) => {
  if (!pathname?.startsWith('/app')) {
    return;
  }

  const head = getHeadComponents() as React.ReactElement[];

  replaceHeadComponents(
    head.map(component => {
      if (
        React.isValidElement(component) &&
        component.type === 'meta' &&
        (component.props as { name?: string }).name === 'viewport'
      ) {
        return React.cloneElement(component as React.ReactElement<any>, {
          content:
            'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
        });
      }

      return component;
    })
  );
};

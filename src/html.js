import React from 'react'
import PropTypes from 'prop-types'

/**
 * Gatsby's default template with one line removed: the hardcoded
 *
 *   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
 *
 * It sits in the template rather than among the head components, so no SSR API
 * can reach it, and the /app routes need a different one: `viewport-fit=cover`,
 * without which every env(safe-area-inset-*) is 0 on iOS and the app's fixed
 * bottom navigation cannot know where the home indicator is.
 *
 * gatsby-ssr's onRenderBody emits the tag instead, choosing the content by
 * pathname. Emitting a second tag here and letting document order decide would
 * have worked too, but one viewport tag per document is the honest version.
 *
 * Everything else is verbatim from .cache/default-html.js.
 */
export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{__html: props.body}}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
}

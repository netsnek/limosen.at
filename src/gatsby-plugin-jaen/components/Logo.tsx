/**
 * The brand mark, chosen by build variant.
 *
 * Both marks were already in the tree, but nothing selected between them: the
 * booklimo build was produced by overwriting this file by hand before running
 * gatsby build, which is why the deployed booklimo site carries the booklimo
 * logo and, at the same time, limosen's og:title.
 *
 * GATSBY_SITE_VARIANT is set from SITE_VARIANT in gatsby-config, and Gatsby
 * inlines GATSBY_* variables at build time, so this resolves to a single import
 * in the bundle rather than shipping both marks.
 */
import LimosenLogo, {LogoProps} from './Logo-limosen'
import BooklimoLogo from './Logo-booklimo'

export type {LogoProps}

export const Logo =
  process.env.GATSBY_SITE_VARIANT === 'booklimo' ? BooklimoLogo : LimosenLogo

export default Logo

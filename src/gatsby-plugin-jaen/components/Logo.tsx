/**
 * The brand mark.
 *
 * This used to choose between two marks on `GATSBY_SITE_VARIANT`, because one
 * source tree served both brands. It does not any more: the other brand has its
 * own repository and its own mark. Re-export rather than rename, so no call site
 * has to move.
 */
import LimosenLogo, {LogoProps} from './Logo-limosen'

export type {LogoProps}

export const Logo = LimosenLogo

export default Logo

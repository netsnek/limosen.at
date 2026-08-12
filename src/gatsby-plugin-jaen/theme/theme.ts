/**
 * The Gatsby shadow that hands jaen this site's brand palette.
 *
 * The path is fixed by gatsby-plugin-jaen and must not move: jaen imports
 * `./theme` from its own theme directory and validates what comes back with
 * isValidSystem, then reads `theme.tokens.colors.brand` off it to colour the CMS
 * chrome. A shadow at any other path would orphan itself.
 *
 * In v3 this has to be a SystemContext, not a theme object. A leftover v2
 * `extendTheme()` result cannot fail loudly: mergeConfigs would deep-merge it,
 * find every key at the wrong nesting level, drop it without a word, and build a
 * site that is correct in every respect except its colour.
 */
import {system} from '../../styles/theme/system'

export default system

/**
 * limosen.at's Chakra v3 system.
 *
 * This replaces theme.ts, which was 167 lines of `extendTheme`. The tokens, the
 * semantic tokens and the two component overrides are the same ones, in v3's
 * shape. Everything beyond that is here for one reason only: v3 changed a
 * default that the old theme relied on without naming it, and the site would
 * silently render differently. Each of those is pinned below with the v2 value
 * and the measurement it came from.
 *
 * `system` is what the site's routes mount. It carries the site's global
 * styles, which in v2 came from Chakra's own `styles.global` and are gone in v3.
 *
 * `chromeSystem` is the same tokens without those globals. Anything mounted
 * INSIDE jaen's frame needs it: in v3 a provider is also the global-style
 * emitter, so handing the CMS the site's `body` rule would restyle the CMS.
 */
import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react'

/**
 * v2's grey ramp, pinned.
 *
 * v3 swapped Chakra's blue-tinted greys for a neutral zinc scale. All ten steps
 * moved, and the site reads ten of them, so without this every grey surface,
 * border and body text shifts hue. Measured pair by pair against
 * @chakra-ui/theme in the untouched tree:
 *
 *   gray.50   #F7FAFC -> #fafafa      gray.500  #718096 -> #71717a
 *   gray.100  #EDF2F7 -> #f4f4f5      gray.600  #4A5568 -> #52525b
 *   gray.200  #E2E8F0 -> #e4e4e7      gray.700  #2D3748 -> #3f3f46
 *   gray.300  #CBD5E0 -> #d4d4d8      gray.800  #1A202C -> #27272a
 *   gray.400  #A0AEC0 -> #a1a1aa      gray.900  #171923 -> #18181b
 */
const v2Gray = {
  50: {value: '#F7FAFC'},
  100: {value: '#EDF2F7'},
  200: {value: '#E2E8F0'},
  300: {value: '#CBD5E0'},
  400: {value: '#A0AEC0'},
  500: {value: '#718096'},
  600: {value: '#4A5568'},
  700: {value: '#2D3748'},
  800: {value: '#1A202C'},
  900: {value: '#171923'}
}

/** The gold ramp. 500 is the brand colour. Unchanged from theme.ts. */
const brand = {
  50: {value: '#fffbeb'},
  100: {value: '#fef3c7'},
  200: {value: '#fde68a'},
  300: {value: '#fcd34d'},
  400: {value: '#fbbf24'},
  500: {value: '#d4af37'},
  600: {value: '#b8932f'},
  700: {value: '#9a7b26'},
  800: {value: '#7a611d'},
  900: {value: '#5a4815'}
}

/** The dark surfaces of the home page. Unchanged from theme.ts. */
const neutral = {
  200: {value: '#1b1b1b'},
  250: {value: '#1c1c1d'},
  300: {value: '#1f1f1f'},
  350: {value: '#252525'},
  400: {value: '#2a2a2a'},
  500: {value: '#333333'},
  700: {value: '#424242'}
}

/**
 * The warm accent scale. Unchanged from theme.ts, and still unused by any call
 * site: the home page's warm look comes from the `limosen` semantic tokens,
 * which point at the gold ramp. Kept because the scale is referenced by name in
 * theme.ts's comment as the intended accent and dropping it would be a decision
 * about the design, not about the migration.
 */
const limosenAccentScale = {
  50: {value: '#fff7ed'},
  100: {value: '#ffedd5'},
  200: {value: '#fed7aa'},
  300: {value: '#fdba74'},
  400: {value: '#fb923c'},
  500: {value: '#f97316'},
  600: {value: '#ea580c'},
  700: {value: '#c2410c'},
  800: {value: '#9a3412'},
  900: {value: '#7c2d12'}
}

/**
 * The dark palette, the old app's, measured rather than chosen.
 *
 * The values are the `.dark` block of the app's former tokens.css, which is
 * still readable at `git show 265b18a:app/shared/styles/tokens.css` in the
 * taxi-app repository and again in limosen-dashboard-chakra's system.ts. The
 * page was charcoal hsl(0 0% 10%), the cards the same charcoal set off by a
 * border, muted surfaces hsl(0 0% 20%), muted text hsl(0 0% 75%), and the
 * primary a gold hsl(48 96% 53%) with black on it.
 *
 * Spelled as hsl() strings, not as entries of a ramp, because none of them
 * is a step of the gold or grey ramp above and inventing steps for them would
 * be a second source for the same numbers.
 */
const dark = {
  canvas: 'hsl(0 0% 10%)',
  surface: 'hsl(0 0% 10%)',
  subtle: 'hsl(0 0% 15%)',
  muted: 'hsl(0 0% 20%)',
  fg: 'hsl(0 0% 100%)',
  fgEmphasized: 'hsl(0 0% 90%)',
  fgMuted: 'hsl(0 0% 75%)',
  fgSubtle: 'hsl(0 0% 60%)',
  border: 'hsl(0 0% 20%)',
  borderEmphasized: 'hsl(0 0% 27%)',
  borderActive: 'hsl(0 0% 35%)',
  gold: 'hsl(48 96% 53%)',
  goldHover: 'hsl(48 96% 47%)',
  goldActive: 'hsl(48 96% 42%)',
  goldEmphasized: 'hsl(48 96% 62%)',
  goldSubtle: 'hsl(48 96% 53% / 0.16)',
  goldMuted: 'hsl(48 96% 53% / 0.28)'
}

/**
 * The eight slots a `colorPalette` resolves against, filled for `brand`.
 *
 * v2's theme set `defaultProps: {colorScheme: 'brand'}` on Button and on
 * nothing else. The v3 spelling is `colorPalette: 'brand'` in the button
 * recipe's base, and on its own that is inert: it maps the numeric ramp, while
 * every v3 recipe reads the eight NAMED slots. Without them the ghost button
 * loses its label colour and the focus ring loses its colour, and a missing
 * custom property is invalid at computed-value time rather than an error, so
 * tsc and gatsby build stay green while it happens.
 *
 * The light values are what v2's brand-schemed button actually produced, read
 * off @chakra-ui/theme rather than chosen:
 *
 *   solid     variantSolid  bg         `${c}.500`
 *   contrast  variantSolid  color      white
 *   fg        variantGhost  color      `${c}.600`
 *   subtle    variantGhost  _hover.bg  `${c}.50`
 *   muted     variantGhost  _active.bg `${c}.100`
 *
 * `emphasized`, `border` and `focusRing` have no v2 origin. They follow jaen's
 * own foundations, which matters beyond consistency: gatsby-plugin-jaen reads
 * `semanticTokens.colors.brand` off this system through the theme shadow and
 * merges it into the CMS chrome, so a divergence here recolours the CMS.
 *
 * `solidHover` and `solidActive` are jaen's two extra slots. jaen's button
 * recipe reads them for its hover and pressed states, and so does the app's
 * every primary button, so they are filled here or jaen's own brand.600 and
 * brand.700 halves show through, which in dark would be a brown on charcoal.
 *
 * The dark halves are the old app's gold on charcoal, see `dark` above: the
 * primary is the bright gold with black on it, the active and hover surfaces
 * (`subtle`, `muted`) are that gold at low alpha so a selected row or nav item
 * reads as a gold tint and not as a yellow block, and `fg` is the gold itself,
 * legible on charcoal where light mode's brand.600 would not be.
 *
 * `base` for the light half: `brand.*` is a name neither v3 nor jaen's
 * defaults reserve, so there is no `_light` to outrank.
 */
const brandColorPalette = {
  solid: {value: {base: '{colors.brand.500}', _dark: dark.gold}},
  solidHover: {value: {base: '{colors.brand.600}', _dark: dark.goldHover}},
  solidActive: {value: {base: '{colors.brand.700}', _dark: dark.goldActive}},
  contrast: {value: {base: '{colors.white}', _dark: '{colors.black}'}},
  fg: {value: {base: '{colors.brand.600}', _dark: dark.gold}},
  muted: {value: {base: '{colors.brand.100}', _dark: dark.goldMuted}},
  subtle: {value: {base: '{colors.brand.50}', _dark: dark.goldSubtle}},
  emphasized: {value: {base: '{colors.brand.600}', _dark: dark.goldEmphasized}},
  border: {value: {base: '{colors.brand.500}', _dark: dark.gold}},
  focusRing: {value: {base: '{colors.brand.500}', _dark: dark.gold}}
}

/**
 * The surfaces, the text and the borders, both halves.
 *
 * These are the names the app's screens and jaen's CMS read: bg.canvas,
 * bg.surface, bg.subtle, bg.muted, fg.default, fg.muted, border.default and
 * their siblings. gatsby-plugin-jaen merges the three groups off this system
 * into its own (packages/gatsby-plugin-jaen/src/theme/system.ts), which is the
 * system in scope on every route inside jaen's frame, /app included. So this
 * is the one place the brand's dark mode is decided, and neither jaen nor the
 * app carries a limosen colour.
 *
 * The public website has no colour mode: gatsby-plugin-jaen forces light on
 * every route outside the CMS and /app, so the `_dark` halves below only ever
 * render inside jaen and the app. The marketing pages keep the palette they
 * always had, and nothing here changes their light rendering: every light
 * half repeats the value jaen's or v3's foundations already resolve to.
 *
 * The light halves are jaen's own, repeated rather than left out, because a
 * token given only a `_dark` here would still be merged as a whole object and
 * take the light value from whichever side merged last. Repeating them makes
 * the site's system and jaen's agree in both modes.
 *
 * `_light`, NOT `base`, for every name v3 defines itself: the three DEFAULTs,
 * bg.panel, bg.emphasized, bg.inverted, bg.subtle, bg.muted, fg.muted,
 * fg.subtle, fg.inverted and border.emphasized. v3 spells
 * its own light value `_light`, a `base` beside it survives the merge and
 * lands on a weaker selector, and v3's grey wins every time. The rest are
 * jaen's names and take `base`. Measured against v3.36.1, and explained in
 * jaen's foundations/semantic-tokens.ts.
 */
const surfaceSemanticTokens = {
  bg: {
    // v3's bare `bg`, `bg.panel` (every Dialog, Popover and Menu panel),
    // `bg.emphasized` and `bg.inverted`. Their light halves are v3's own, so
    // light mode does not move. Without the dark halves a dialog in dark sits
    // on v3's gray.950, a blue-black that is not the brand's charcoal, and
    // the old app's popover was the same 10% grey as its page.
    DEFAULT: {value: {_light: '{colors.white}', _dark: dark.canvas}},
    panel: {value: {_light: '{colors.white}', _dark: dark.surface}},
    emphasized: {value: {_light: '{colors.gray.300}', _dark: dark.muted}},
    inverted: {value: {_light: '{colors.black}', _dark: dark.fg}},
    canvas: {value: {base: '{colors.gray.50}', _dark: dark.canvas}},
    surface: {value: {base: '{colors.white}', _dark: dark.surface}},
    subtle: {value: {_light: '{colors.gray.50}', _dark: dark.subtle}},
    muted: {value: {_light: '{colors.gray.100}', _dark: dark.muted}},
    translucent: {
      value: {base: 'rgba(255, 255, 255, 0.8)', _dark: 'hsl(0 0% 10% / 0.85)'}
    }
  },
  fg: {
    DEFAULT: {value: {_light: '{colors.black}', _dark: dark.fg}},
    default: {value: {base: '{colors.gray.900}', _dark: dark.fg}},
    emphasized: {value: {base: '{colors.gray.700}', _dark: dark.fgEmphasized}},
    muted: {value: {_light: '{colors.gray.600}', _dark: dark.fgMuted}},
    subtle: {value: {_light: '{colors.gray.500}', _dark: dark.fgSubtle}},
    inverted: {value: {_light: '{colors.white}', _dark: dark.canvas}}
  },
  border: {
    DEFAULT: {value: {_light: '{colors.gray.200}', _dark: dark.border}},
    default: {value: {base: '{colors.gray.200}', _dark: dark.border}},
    emphasized: {value: {_light: '{colors.gray.300}', _dark: dark.borderEmphasized}},
    active: {value: {base: '{colors.gray.400}', _dark: dark.borderActive}}
  }
}

/**
 * The home page's dark surfaces, as semantic tokens.
 *
 * These are theme.ts's `limosen.*` tokens, unchanged in path and value, because
 * 96 call sites read them by path. The comments in theme.ts named the exact
 * colours the design asked for and they are preserved literally.
 *
 * Two things had to change shape rather than value. v3 resolves a dotted token
 * path against a NESTED tree, and a node cannot be both a value and a parent:
 * given `accent` and `accent.emphasis`, the leaf wins and the child resolves to
 * undefined, silently. theme.ts had exactly that collision twice, on `accent`
 * and on `limosen.accent`. Verified against v3.36.1: `colors.accent.emphasis`
 * comes back undefined while `colors.accent` resolves.
 *
 * `limosen.accent` stays a leaf, because seven call sites read it and none read
 * a child. The two children only ever fed the button variants below, which now
 * name `brand.600` and `black` directly, which is what the children resolved to.
 *
 * The whole unprefixed family (`bg.canvas`, `bg.header`, `bg.section`,
 * `bg.surface`, `bg.surfaceAlt`, `text.primary`, `text.secondary`, `text.muted`,
 * `border.faint`, `border.subtle`, `accent`, `accent.emphasis`, `accent.muted`,
 * `accent.on`) is gone. Not one of those fourteen tokens is read anywhere
 * outside theme.ts, checked across every .ts, .tsx and .css file in src.
 */
const limosenSemanticTokens = {
  bg: {
    // banner #1b1b1b, nav top #1c1c1c, ueber uns #2f2f2f, fleet #1b1b1b,
    // cards #252525, cars backdrop white, footer #0f0f0f
    canvas: {value: '#1b1b1b'},
    banner: {value: '#1b1b1b'},
    navTop: {value: '#1c1c1c'},
    about: {value: '#2f2f2f'},
    fleet: {value: '#1b1b1b'},
    card: {value: '#252525'},
    carsBackdrop: {value: 'white'},
    footer: {value: '#0f0f0f'},
    section: {value: '{colors.neutral.200}'},
    surface: {value: '{colors.neutral.350}'},
    surfaceAlt: {value: '{colors.neutral.300}'}
  },
  text: {
    primary: {value: '{colors.whiteAlpha.900}'},
    secondary: {value: '{colors.whiteAlpha.800}'},
    muted: {value: '{colors.whiteAlpha.700}'}
  },
  border: {
    faint: {value: '{colors.whiteAlpha.100}'},
    subtle: {value: '{colors.whiteAlpha.200}'}
  },
  accent: {value: '{colors.brand.500}'}
}

/**
 * v2's Button, expressed as a v3 recipe.
 *
 * theme.ts overrode only the three variants and the default colour scheme, so
 * everything else came from @chakra-ui/theme's stock button, and v3's stock
 * button is not the same object. Five defaults moved, and every button on the
 * site pays for all five:
 *
 *   fontWeight   v2 semibold, v3 medium. Every label one step lighter.
 *   borderWidth  v2 none, v3 1px transparent. Two pixels of width and height
 *                that v2 never paid.
 *   lineHeight   v2 1.2 in the base and nothing overrode it. v3 keeps 1.2 in
 *                the base but puts a textStyle in every size, and a textStyle's
 *                line-height is a length that outranks the base. 20px where v2
 *                computed 16.8px.
 *   fontSize     the same textStyle carries a size. v3's md is 14px, v2's md
 *                was 16px, so every button that does not name a size shrank.
 *   h/minW/px    v3 moved xs from 6 to 8, sm from 8 to 9, lg from 12 to 11 and
 *                shifted the paddings with them.
 *
 * `textStyle: ''` in each size is load bearing. A textStyle expands late and
 * beats a lineHeight declared beside it, so setting fontSize and lineHeight
 * alone yields v2's size with v3's leading. Blanking it first lets both through.
 *
 * Every background is spelled `bg`, never `bgColor`. v3's engine sorts the final
 * declarations by property, shorthands before longhands, so a recipe's
 * `background-color` is emitted after a call site's `background` and quietly
 * beats it. A `bg` prop at the call site could then never override this recipe.
 */
const buttonRecipe = {
  base: {
    // v2's `defaultProps: {colorScheme: 'brand'}`, which v3 dropped without an
    // equivalent. Scoped to the button on purpose: v2 set it on the button and
    // on nothing else, so putting it on `html` instead would also recolour
    // inputs, checkboxes and switches, which v2 left at their own defaults.
    colorPalette: 'brand',
    fontWeight: 'semibold',
    borderWidth: 0,
    // v2's button base was `borderRadius: md`, 6px. v3 spells it `l2`, which
    // resolves to radii.sm, 4px. Measured against the live site on the Login and
    // the nav buttons: every corner on every page was two pixels tighter, which
    // is what the last 104 changed pixels per page turned out to be.
    borderRadius: 'md',
    /**
     * v2's button did not size the icons inside it at all, so a react-icons
     * glyph rendered at its own 1em and a Chakra icon at the 1em its wrapper
     * declares. v3's recipe sizes every descendant svg through
     * `_icon: {width: 4, height: 4}` at size sm and 5 at md, emitted as
     * `& :where(svg)`, which any glyph's own width attribute loses to. The eight
     * social buttons in the footer grew visibly.
     *
     * A plain `& svg` is specificity (0,1,1) against the recipe's (0,1,0), so it
     * wins without needing !important, and a call site that really wants a
     * bigger glyph still outranks it with a style prop.
     *
     * The `fontSize` is not redundant. v3's rule sets `font-size: 1.2em` on the
     * svg as well, so a width of 1em would resolve against 1.2 times the
     * button's own size and still come out too big. Measured against the live
     * site on the social buttons: 16.8px where v2 painted 14px.
     */
    '& svg': {width: '1em', height: '1em', fontSize: '1em'}
  },
  variants: {
    size: {
      lg: {textStyle: '', h: '12', minW: '12', fontSize: 'lg', px: '6', gap: 2, lineHeight: 1.2},
      md: {textStyle: '', h: '10', minW: '10', fontSize: 'md', px: '4', gap: 2, lineHeight: 1.2},
      sm: {textStyle: '', h: '8', minW: '8', fontSize: 'sm', px: '3', gap: 2, lineHeight: 1.2},
      xs: {textStyle: '', h: '6', minW: '6', fontSize: 'xs', px: '2', gap: 2, lineHeight: 1.2}
    },
    variant: {
      // theme.ts: bg accent, color accent.on, hover accent.emphasis, active
      // brand.700. `accent` was brand.500 and `accent.on` was black.
      solid: {
        bg: 'brand.500',
        color: 'black',
        _hover: {bg: 'brand.600'},
        _active: {bg: 'brand.700'}
      },
      /**
       * The home page's button, and visually the same as `solid`.
       *
       * theme.ts pointed it at `limosen.accent`, `limosen.accent.on` and
       * `limosen.accent.emphasis`, which resolved to brand.500, black and
       * brand.600, the same three colours `solid` uses. Six call sites in
       * Content.tsx ask for it by name, so the variant stays rather than being
       * folded into solid, but nothing about it is a second look.
       */
      limosen: {
        bg: 'limosen.accent',
        color: 'black',
        _hover: {bg: 'brand.600'},
        _active: {bg: 'brand.700'}
      },
      // theme.ts overrode only the two states. The label colour keeps coming
      // from the palette's `fg` slot, which is what v2's ghost variant read as
      // `${colorScheme}.600`.
      ghost: {
        _hover: {bg: 'blackAlpha.50'},
        _active: {bg: 'blackAlpha.100'}
      }
    }
  }
}

/**
 * The seven sizes two components select by name, and the reason they are sizes.
 *
 * v2 set all seven with a flat `fontSize` STYLE PROP: 36/30/24/20/18/16 for
 * h1 to h6 in docs/heading/components/Heading.tsx, and 12px for
 * SearchResultSectionTitle. Unitless strings in v2, because v2's `fontSize`
 * carried the `px` transform (@chakra-ui/styled-system config/typography.ts)
 * and turned '36' into '36px'.
 *
 * Both components now pass `size` instead, because in v3 a style prop cannot
 * reach the recipe's responsive default: cva() serialises `size: xl`'s
 * `fontSize: ['3xl', null, '4xl']` into an `@media (min-width: 48rem)` key
 * before the style props merge, so a prop replaces only the unconditional entry
 * and the media rule wins it back from 768px up.
 *
 * A size the table does not carry is not an error, which is what made this
 * worth pinning: cva falls through to NO size styles at all. Measured against
 * v3.36.1 before this block existed, `size="h2"` resolved to fontFamily and
 * fontWeight and nothing else, so every docs heading and every search group
 * label rendered at the size it happened to inherit.
 *
 * `lineHeight` is v2's `xl` pair throughout, because that is what v2 actually
 * kept: both components overrode fontSize alone and left the default size's
 * leading in place.
 */
const pxHeadingSize = (px: number) => ({
  fontSize: `${px}px`,
  // A fresh array per entry. Chakra merges recipes with mergeWith, which
  // assigns an array reference straight through and then mutates it in place on
  // the next merge, so one shared literal would be a live wire between them.
  lineHeight: [1.33, null, 1.2]
})

const namedHeadingSizes = {
  h1: pxHeadingSize(36),
  h2: pxHeadingSize(30),
  h3: pxHeadingSize(24),
  h4: pxHeadingSize(20),
  h5: pxHeadingSize(18),
  h6: pxHeadingSize(16),
  'menu-group': pxHeadingSize(12)
}

/**
 * v2's Heading size table.
 *
 * theme.ts registered no Heading style, so v2's stock sizes applied, and v3's
 * are a different scale on a different mechanism: v2's `size` picked a fontSize
 * pair, v3's picks a textStyle. Sixteen call sites name sm, md or lg. All eight
 * sizes are pinned because v3's default is `xl` and any heading without a size
 * reads it.
 *
 * The responsive pairs are v2's own, from @chakra-ui/theme components/heading.
 */
const headingRecipe = {
  base: {fontFamily: 'heading', fontWeight: 'bold'},
  variants: {
    size: {
      '4xl': {fontSize: ['6xl', null, '7xl'], lineHeight: 1},
      '3xl': {fontSize: ['5xl', null, '6xl'], lineHeight: 1},
      '2xl': {fontSize: ['4xl', null, '5xl'], lineHeight: [1.2, null, 1]},
      xl: {fontSize: ['3xl', null, '4xl'], lineHeight: [1.33, null, 1.2]},
      lg: {fontSize: ['2xl', null, '3xl'], lineHeight: [1.33, null, 1.2]},
      md: {fontSize: 'xl', lineHeight: 1.2},
      sm: {fontSize: 'md', lineHeight: 1.2},
      xs: {fontSize: 'sm', lineHeight: 1.2},
      ...namedHeadingSizes
    }
  }
}

/**
 * v2's Container gutter.
 *
 * v2's stock Container was a flat `px: 4`, sixteen pixels at every width. v3's
 * is `px: {base: '4', md: '6', lg: '8'}`, so the gutter grows to 24px at md and
 * 32px at the pinned lg. Seventeen call sites, none of which mention px, and
 * the site registered no Container style in v2, so this default moved
 * underneath all of them.
 *
 * Restoring the scalar also restores prop overrides: cva() serialises a recipe
 * before style props merge, so with a responsive default in place a `px={0}` at
 * a call site only ever replaces the unconditional entry and the media queries
 * survive it.
 *
 * maxWidth stays at v3's value, every call site passes its own.
 */
const containerRecipe = {
  base: {px: '4'}
}

/**
 * v2's FormControl rhythm, restored on v3's Field.
 *
 * The two modals carry eight and eleven form rows, and v2 spaced them with
 * margins on the parts: FormLabel `mb: 2`, FormErrorMessage `mt: 2`,
 * FormHelperText `mt: 2`, with no gap on the control itself. v3's field root
 * declares `gap: 1.5` instead and drops the margins, so every row came out 6px
 * where v2 had 8px, and the label sat 6px from its input rather than 8px.
 *
 * The type sizes are pinned too, and they had to be. The two modals do pass
 * `fontSize="sm"` on every label and every error message, so the recipe never
 * reaches them, but signup.tsx renders sixteen more Field rows that pass
 * nothing, and v3's own textStyles are not v2's values:
 *
 *   label      v2 FormLabel `fontSize: md` (16px) with the body's inherited 1.5
 *              leading. v3's label carries `textStyle: sm`, which is 14px with a
 *              20px line box.
 *   errorText  v2 FormErrorMessage `fontSize: sm, lineHeight: normal`. v3's
 *              errorText carries `textStyle: xs`, 12px in a 16px line box.
 *   helperText the same pair, and v2's colour was `gray.600`, not gray.500.
 *
 * Measured against v3.36.1 on the merged recipe. `lineHeight: inherit` on the
 * label rather than a literal 1.5, because v2 declared none at all and took
 * whatever the row inherited. A sibling declaration outranks a textStyle's own
 * line-height here, verified on the same merge, so no `textStyle: ''` is needed.
 *
 * All four are still overridable from a call site, which is what keeps the
 * modals at the 14px they ask for in both trees. The error colour is pinned for
 * the same reason: v3 takes it from `fg.error` where v2 had a literal `red.500`.
 */
const fieldSlotRecipe = {
  slots: [
    'root',
    'errorText',
    'helperText',
    'input',
    'label',
    'select',
    'textarea',
    'requiredIndicator'
  ],
  base: {
    root: {gap: '0'},
    label: {mb: '2', fontSize: 'md', lineHeight: 'inherit'},
    errorText: {mt: '2', color: 'red.500', fontSize: 'sm', lineHeight: 'normal'},
    helperText: {
      mt: '2',
      color: 'gray.600',
      fontSize: 'sm',
      lineHeight: 'normal'
    },
    // v2 drew the asterisk in red.500 through FormLabel's requiredIndicator.
    requiredIndicator: {color: 'red.500'}
  }
}

/**
 * theme.ts's Card variant, moved from v2's `container` part to v3's `root`.
 *
 * v2's Card slots were container/header/body/footer, v3's are
 * root/header/body/footer/title/description.
 */
const cardSlotRecipe = {
  slots: ['root', 'header', 'body', 'footer', 'title', 'description'],
  // v2's Card defaulted to the elevated variant, a shadow and no border, with
  // radii.md from size md. v3 defaults to outline, a border and no shadow, with
  // a larger radius. The docs image cards are the visible consequence.
  defaultVariants: {variant: 'elevated', size: 'md'},
  variants: {
    variant: {
      limosen: {
        root: {
          bg: 'limosen.bg.card',
          color: 'limosen.text.primary',
          borderColor: 'limosen.border.subtle',
          borderWidth: '1px',
          borderRadius: 'xl'
        }
      }
    }
  }
}

/**
 * The five recipes the site never registered in v2 and therefore inherited.
 *
 * theme.ts styled Button and Card and nothing else, so every other component
 * rendered @chakra-ui/theme's stock values. v3's stock values are different, and
 * these five differ in ways a screenshot shows. Each value below is v2's, read
 * off the installed packages rather than remembered.
 *
 * `textStyle: ''` appears again for the same reason it does in the button sizes:
 * v3 puts a textStyle in every size, a textStyle's line-height is a length that
 * outranks a lineHeight beside it, and blanking it first lets v2's pair through.
 */
const checkboxSlotRecipe = {
  slots: ['root', 'label', 'control', 'indicator', 'group'],
  base: {
    // v2's Checkbox defaulted to colorScheme blue and the site never changed it.
    // v3 resolves the checked background against colorPalette, which is gray
    // unless something says otherwise, so the box went grey when ticked.
    root: {colorPalette: 'blue'},
    control: {
      // v2's control drew a 2px border. v3 draws 1px.
      borderWidth: '2px',
      // v2 sized the checkmark at 0.625rem inside a 16px box. v3 stretches the
      // glyph to the full content box through `& :where(svg) {width: 100%}`,
      // which a plain `& svg` outranks.
      '& svg': {boxSize: '0.625rem'}
    }
  },
  variants: {
    size: {
      // v2's md control was 16px with no padding. v3's is 20px with 2px.
      md: {control: {boxSize: '4', p: '0'}}
    }
  }
}

const textareaRecipe = {
  base: {
    // v2's textarea carried minHeight 20 (5rem) and lineHeight short. v3 has
    // neither, so the message box fell back to the browser's two rows and lost
    // about a third of its height in both modals.
    minHeight: '20',
    lineHeight: 'short'
  },
  variants: {
    size: {
      md: {textStyle: '', fontSize: 'md', px: '4', py: '2'}
    }
  }
}

const inputRecipe = {
  variants: {
    size: {
      // v2: fontSize md, px 4, radius md. v3: textStyle sm (14px), px 3,
      // radius l2 which resolves to radii.sm.
      md: {textStyle: '', fontSize: 'md', px: '4', borderRadius: 'md'}
    },
    variant: {
      outline: {
        // v2's outline input hovered to gray.300 and focused on blue.500. v3
        // hovers nothing and takes the focus colour from colorPalette, which is
        // gray on every input the site renders. The modals set their own gold
        // focus at the call site, in v2 exactly as now, and a style prop still
        // outranks this.
        _hover: {borderColor: 'gray.300'},
        '--focus-color': 'colors.blue.500'
      }
    }
  }
}

const dialogSlotRecipe = {
  slots: [
    'trigger',
    'backdrop',
    'positioner',
    'content',
    'title',
    'description',
    'closeTrigger',
    'header',
    'body',
    'footer'
  ],
  base: {
    // v2's modal let its text inherit the body's 16px/1.5. v3's content slot
    // declares textStyle sm, so every unsized paragraph in both modals shrank
    // to 14px.
    content: {textStyle: '', fontSize: 'md', lineHeight: 1.5},
    // v2's overlay was blackAlpha.600, v3's backdrop is blackAlpha.500.
    backdrop: {bg: 'blackAlpha.600'},
    // v2's ModalFooter was py 4. v3 halves the top half to pt 2.
    footer: {pt: '4'}
  }
}

const separatorRecipe = {
  // v2's Divider baseStyle was `{opacity: 0.6, borderColor: 'inherit'}`. v3's
  // separator has no opacity, so every rule on the site painted at full
  // strength. The colour needs no pinning: v3's `border` token is the same
  // gray.200, because the grey ramp above is v2's.
  base: {opacity: 0.6}
}

const linkRecipe = {
  // v2's Link had no gap and laid its children out inline. v3's is an
  // inline-flex with gap 1.5, which lands on top of the margins the icon
  // call sites already carry. The hover underline is NOT reverted: v2's Link
  // underlined on hover too.
  base: {gap: '0'}
}

const accordionSlotRecipe = {
  slots: ['root', 'item', 'itemTrigger', 'itemContent', 'itemIndicator', 'itemBody'],
  base: {
    // v2's Accordion drew a hairline above every item and one below the last,
    // inheriting the global border colour. v3's outline variant draws a bottom
    // border instead, and the site's `variant="leftNav"` matches nothing in
    // either theme, so no border was drawn at all.
    item: {
      borderTopWidth: '1px',
      borderColor: 'inherit',
      _last: {borderBottomWidth: '1px'}
    },
    // v2's AccordionButton darkened on hover, which coexisted with the call
    // sites' own background because v2 merged the two shallowly. v3's
    // itemTrigger has no hover style, so the services and FAQ headers on the
    // home page and every expandable label in the docs nav stopped reacting.
    itemTrigger: {_hover: {bg: 'blackAlpha.50'}}
  }
}

const listSlotRecipe = {
  slots: ['root', 'item', 'indicator'],
  variants: {
    variant: {
      // v3's default `marker` variant paints bullets and numbers in fg.subtle.
      // v2's List styled no marker at all, so they took the text colour, and
      // every list in the docs now reads with grey markers against darker text.
      marker: {item: {_marker: {color: 'inherit'}}}
    }
  }
}

const nativeSelectSlotRecipe = {
  slots: ['root', 'field', 'indicator'],
  base: {
    // v2's Select chevron was `currentColor` at fontSize xl. v3's indicator is
    // fg.muted at textStyle lg, so the five chevrons in the booking form read
    // lighter and a shade smaller.
    indicator: {color: 'currentColor', fontSize: 'xl'}
  }
}

export const siteConfig = defineConfig({
  // The site hard-codes no `var(--chakra-...)` anywhere, checked across src, so
  // the prefix is free. It stays `chakra` because jaen takes `jaen` for its own
  // system and two disjoint prefixes cannot collide whatever selector they land
  // on, which is what replaces v2's cssVarsRoot scoping.
  cssVarsPrefix: 'chakra',
  // dist/jaen.css still ships an unlayered preflight, and an unlayered normal
  // declaration beats every cascade layer regardless of specificity. Comes back
  // out when that bundle stops shipping one.
  disableLayers: true,
  theme: {
    // v3 moved lg from 62em (992px) to 1024px. Pinned, or every responsive
    // array in the site changes breakpoint at a width nobody chose.
    breakpoints: {
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      '2xl': '1536px'
    },
    tokens: {
      colors: {
        // v2's black was #000000, v3's is #09090B. Five call sites ask for
        // `black` and the solid button label is one of them, so all five were
        // three per cent off the value v2 painted. `white` is #FFFFFF in both.
        black: {value: '#000000'},
        gray: v2Gray,
        brand,
        neutral,
        limosen: limosenAccentScale
      },
      fonts: {
        // theme.ts's stack, and it is loaded by @font-face in global.css.
        heading: {value: '"Segoe UI", sans-serif'},
        body: {value: '"Segoe UI", sans-serif'},
        // Not declared in theme.ts, which in v2 meant Chakra's default. v3's
        // default is a different stack, so v2's is written out. No call site
        // asks for mono today, this only keeps a later one honest.
        mono: {
          value:
            'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
        }
      },
      // v3 renamed the borders scale to xs/sm/md/lg/xl and dropped the pixel
      // keys, so `border="1px"` no longer resolves. An unresolvable value is
      // emitted literally, which resets border-style to its initial `none` and
      // paints nothing. Seven call sites depend on it.
      borders: {
        '1px': {value: '1px solid'},
        '2px': {value: '2px solid'},
        '4px': {value: '4px solid'},
        '8px': {value: '8px solid'}
      }
    },
    semanticTokens: {
      colors: {
        brand: brandColorPalette,
        ...surfaceSemanticTokens,
        limosen: limosenSemanticTokens
      }
    },
    // signup.tsx reads `limosen.page`. `limosen.surface` had no call site in v2
    // either and is kept as the pair it was defined as.
    layerStyles: {
      'limosen.page': {
        value: {
          bg: 'limosen.bg.canvas',
          color: 'limosen.text.primary',
          minH: '100dvh'
        }
      },
      'limosen.surface': {
        value: {
          bg: 'limosen.bg.surface',
          color: 'limosen.text.primary',
          borderColor: 'limosen.border.subtle',
          borderWidth: '1px',
          borderRadius: 'xl'
        }
      }
    },
    recipes: {
      button: buttonRecipe,
      heading: headingRecipe,
      container: containerRecipe,
      input: inputRecipe,
      textarea: textareaRecipe,
      separator: separatorRecipe,
      link: linkRecipe
    },
    slotRecipes: {
      card: cardSlotRecipe,
      field: fieldSlotRecipe,
      checkbox: checkboxSlotRecipe,
      dialog: dialogSlotRecipe,
      accordion: accordionSlotRecipe,
      list: listSlotRecipe,
      nativeSelect: nativeSelectSlotRecipe
    }
  }
})

/**
 * jaen's provider owns the reset and is mounted on every route, so the site's
 * config is stripped of the base globals before they can be emitted twice.
 */
const {
  globalCss: _jaenOwnsGlobals,
  preflight: _jaenOwnsPreflight,
  ...base
} = defaultConfig

/** Mounted on the site's routes. Carries the site's globals. */
export const system = createSystem(
  base,
  siteConfig,
  defineConfig({
    preflight: false,
    globalCss: {
      /**
       * v2's reset, written out, because v3's is not a drop-in replacement.
       *
       * jaen used to apply its reset to the whole document and now scopes it to
       * the CMS frame, which is correct. That leaves the site to supply its own,
       * and the honest one to supply is the one v2 had.
       *
       * The difference is one declaration and it is not cosmetic. v3's preflight
       * adds `font: inherit` to the universal rule, and SVG presentation
       * attributes are author-origin with zero specificity, so they lose to any
       * declaration at all: every inline SVG that sizes its own text with
       * `font-size="7.8"` would inherit 16px instead. @chakra-ui/css-reset's
       * own rule, verbatim.
       */
      '*, *::before, *::after': {
        borderWidth: '0',
        borderStyle: 'solid',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        // v2's styles.global put `borderColor: chakra-border-color` on the same
        // universal rule, gray.200 in light mode. Without it a border-width with
        // no colour of its own falls back to CSS's initial `currentColor`, so
        // every such rule takes the text colour instead of the grey line v2 drew.
        borderColor: {base: 'gray.200', _dark: 'whiteAlpha.300'}
      },
      /**
       * v3's own baseline, put back after stripping its globalCss.
       *
       * `defaultConfig.globalCss` is where v3 declares `html {colorPalette:
       * gray}`, and dropping it left `--chakra-colors-color-palette-*` undefined
       * for every component that is not a button, which is every focus ring on
       * the site and the mdx editor's tab indicator. An undefined custom property
       * is invalid at computed-value time rather than an error, so nothing
       * complains, the colour simply never arrives.
       *
       * `gray` and not `brand`: v2 set brand on the Button alone, which the
       * button recipe now carries itself. The sibling site declares brand here
       * because its v2 used withDefaultColorScheme globally, and copying that
       * would repaint every input, checkbox and switch on this site gold.
       */
      html: {colorPalette: 'gray'},
      /**
       * v2's body rule, restored.
       *
       * On site routes this came from Chakra's `styles.global.body` inside the
       * site's own provider. `fontFamily` is the one that matters most: without
       * it the site inherits the font jaen's preflight puts on `html`, which is
       * jaen's own typeface, on every word of every page.
       *
       * The pair is v2's own `chakra-body-bg` and `chakra-body-text`, both
       * halves. theme.ts declared no `_dark` value of its own and set
       * `initialColorMode: 'light'`, so light is what a visitor lands on, but
       * the toggle is reachable: NavbarControls renders one in LeftNav and in
       * MobileNavDrawer, and v2's body followed it because those two semantic
       * tokens carried `_dark` halves in @chakra-ui/theme (gray.800 and
       * whiteAlpha.900). Pinning only the light half would leave dark mode with
       * a white page under text that still inverts.
       *
       * lineHeight is not restored. v2 set 1.5 here, and jaen's provider still
       * puts 1.5 on `html` through the global styles it inherits from v3's
       * defaults, so the site would only be declaring it a second time.
       */
      body: {
        fontFamily: 'body',
        bg: {base: 'white', _dark: 'gray.800'},
        color: {base: 'gray.800', _dark: 'whiteAlpha.900'},
        transitionProperty: 'background-color',
        // v2's `durations.normal`. v3's scale renamed it away, so the value is
        // spelled out.
        transitionDuration: '200ms'
      }
    }
  })
)

/** The v3 spelling of v2's bare provider: tokens, no globals. */
export const chromeSystem = createSystem(base, siteConfig)

export default system

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
 * The values are what v2's brand-schemed button actually produced, read off
 * @chakra-ui/theme rather than chosen:
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
 * The site is light only, so no slot carries a `_dark` half. Every semantic
 * token in theme.ts had a single value and the site never mounted a dark mode.
 */
const brandColorPalette = {
  solid: {value: '{colors.brand.500}'},
  contrast: {value: '{colors.white}'},
  fg: {value: '{colors.brand.600}'},
  muted: {value: '{colors.brand.100}'},
  subtle: {value: '{colors.brand.50}'},
  emphasized: {value: '{colors.brand.600}'},
  border: {value: '{colors.brand.500}'},
  focusRing: {value: '{colors.brand.500}'}
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
    borderWidth: 0
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
      xs: {fontSize: 'sm', lineHeight: 1.2}
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
 * theme.ts's Card variant, moved from v2's `container` part to v3's `root`.
 *
 * v2's Card slots were container/header/body/footer, v3's are
 * root/header/body/footer/title/description.
 */
const cardSlotRecipe = {
  slots: ['root', 'header', 'body', 'footer', 'title', 'description'],
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
      container: containerRecipe
    },
    slotRecipes: {
      card: cardSlotRecipe
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
        wordWrap: 'break-word'
      },
      /**
       * v2's body rule, restored.
       *
       * On site routes this came from Chakra's `styles.global.body` inside the
       * site's own provider. `fontFamily` is the one that matters most: without
       * it the site inherits the font jaen's preflight puts on `html`, which is
       * jaen's own typeface, on every word of every page.
       *
       * The pair is v2's light half, `chakra-body-bg` white and
       * `chakra-body-text` gray.800, because the site never mounted a dark mode:
       * theme.ts set `initialColorMode: 'light'` with `useSystemColorMode:
       * false` and not one semantic token declared a `_dark` half.
       *
       * lineHeight is not restored. v2 set 1.5 here and v3's preflight already
       * puts 1.5 on `html`.
       */
      body: {
        fontFamily: 'body',
        bg: 'white',
        color: 'gray.800',
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

// theme.ts
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: false,
};

const colors = {
  // Gold / Yellow brand scale (logo-led)
  brand: {
    50:  "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#d4af37", // logo gold
    600: "#b8932f",
    700: "#9a7b26",
    800: "#7a611d",
    900: "#5a4815",
  },

  // Neutral dark scale to replace inline hex grays
  neutral: {
    25:  "#0b0b0b",
    50:  "#0f0f0f", // footer
    100: "#171717",
    200: "#1b1b1b", // section bg
    250: "#1c1c1c", // top nav bg
    300: "#1f1f1f", // booking section
    350: "#252525", // cards
    400: "#2a2a2a",
    450: "#2f2f2f", // about section
    500: "#333333",
    600: "#3a3a3a",
    700: "#424242", // page canvas
  },
};

const semanticTokens = {
  colors: {
    // Surfaces
    "bg.canvas": { default: "neutral.700" },
    "bg.header": { default: "neutral.250" },
    "bg.headerBar": { default: "neutral.200" },
    "bg.section": { default: "neutral.200" },
    "bg.sectionAlt": { default: "neutral.450" },
    "bg.surface": { default: "neutral.350" },
    "bg.surfaceAlt": { default: "neutral.300" },

    // Text
    "text.primary": { default: "blackAlpha.900" },
    "text.secondary": { default: "blackAlpha.800" },
    "text.muted": { default: "blackAlpha.700" },

    // Borders
    "border.faint": { default: "whiteAlpha.100" },
    "border.subtle": { default: "whiteAlpha.200" },

    // Accents (gold)
    accent: { default: "brand.500" },
    "accent.emphasis": { default: "brand.600" },
    "accent.muted": { default: "brand.200" },
    "accent.on": { default: "black" },

    // Special for hamburger bars (kept)
    "topNav.mobile.hamburger.bgColor": { default: "text.primary" },
  },
};

const components = {
  Button: {
    defaultProps: { colorScheme: "brand" },
    variants: {
      solid: {
        bg: "accent",
        color: "accent.on",
        _hover: { bg: "accent.emphasis" },
        _active: { bg: "brand.700" },
      },
      outline: {
        borderColor: "accent",
        color: "accent",
        _hover: { bg: "whiteAlpha.100" },
      },
      ghost: {
        color: "text.primary",
        _hover: { bg: "whiteAlpha.200", color: "accent" },
      },
    },
  },
  IconButton: {
    defaultProps: { variant: "ghost" },
    variants: {
      ghost: {
        color: "text.primary",
        _hover: { color: "accent", bg: "whiteAlpha.200" },
      },
    },
  },
  Link: {
    baseStyle: {
      color: "text.primary",
      _hover: { color: "accent", textDecoration: "none" },
    },
  },
  Divider: { baseStyle: { borderColor: "border.subtle" } },
  Accordion: {
    baseStyle: {
      container: { border: "none" },
      button: {
        bg: "whiteAlpha.50",
        border: "1px solid",
        borderColor: "border.faint",
        _expanded: {
          bg: "whiteAlpha.200",
          borderColor: "accent",
          color: "text.primary",
        },
      },
    },
  },
  Menu: {
    baseStyle: {
      list: { bg: "bg.header", borderColor: "border.faint" },
      item: { _hover: { bg: "whiteAlpha.200", color: "text.primary" } },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: "neutral.100",
      color: "text.primary",
      border: "1px solid",
      borderColor: "border.faint",
    },
  },
  Heading: { baseStyle: { color: "text.primary" } },
  Text: { baseStyle: { color: "text.primary" } },
  Container: { baseStyle: { px: { base: 4, md: 6 } } },
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  components,
});

export default theme;
export { theme };

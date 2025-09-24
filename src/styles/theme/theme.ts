import {
  extendTheme,
  type ThemeConfig,
  withDefaultColorScheme
} from '@chakra-ui/react';
// import themeComponents from './components';
// import themeColors from './colors';
// import themeSemanticTokens from './semanticTokens/semanticTokens';
// import themeFonts from './fonts';

// const theme: ThemeConfig = extendTheme(
//   {
//     initialColorMode: 'system',
//     useSystemColorMode: true, //? This doesnt sync with the system color mode
//     /**
//      * SEMANTIC TOKENS
//      */
//     semanticTokens: themeSemanticTokens,
//     /**
//      * CUSTOM COLORS
//      */
//     colors: themeColors,
//     /**
//      * CUSTOM FONTS
//      */
//     fonts: themeFonts,
//     /**
//      * COMPONENT CUSTOMIZATIONS
//      */
//     components: themeComponents
//   },
//   withDefaultColorScheme({
//     colorScheme: 'brand'
//   })
// );

// export default theme;
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#424242',
      },
    },
  },
  fonts: {
    heading: '"Segoe UI", sans-serif',
    body: '"Segoe UI", sans-serif',
  },
});

export default theme;

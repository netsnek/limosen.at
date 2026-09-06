import { Box, ChakraProvider } from '@chakra-ui/react';

import SearchMenu from '../../components/search-menu';
import { chromeSystem } from '../../styles/theme/system';

export interface ToolbarProps {}

/**
 * The only mount of SearchMenu that renders inside jaen's frame.
 *
 * On a site route the site's own provider is already above it, through the
 * branch in gatsby-plugin-jaen's Layout, and SearchMenu simply inherits it. In
 * the frame it does not: the frame is a sibling of the page layout under jaen's
 * root provider, so without a provider here the search box compiles against
 * jaen's system and reads jaen's grey ramp, jaen's fonts and jaen's button
 * recipe instead of the site's.
 *
 * v2 had one here too. SearchMenu itself wrapped its output in
 * `<ThemeProvider theme={theme}>`, and v2's ThemeProvider emitted the theme's
 * CSS variables at `:host, :root` alongside providing it, so the site's tokens
 * were live wherever SearchMenu was mounted. `chromeSystem` is the same tokens
 * with none of the site's global rules, which is all this position needs.
 *
 * It belongs here rather than back inside SearchMenu because SearchMenu renders
 * in four places and a v3 provider re-emits the whole token block every time it
 * mounts. This is the single mount that is not already covered.
 */
export const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <ChakraProvider value={chromeSystem}>
      {/*
        Hidden below md on purpose. The frame's top bar has room for the brand
        mark and nothing else on a phone, and the search overlay is reachable
        from the page itself. `hideBelow` emits a media query rather than
        unmounting, so the overlay's keyboard shortcut keeps working on a
        desktop that is merely narrow.
      */}
      <Box hideBelow="md">
        {/*
          radii.control, so the search sits at the 8 px of every other button
          in the bar (design-consistency.md, rule 1). The site's own button
          recipe rounds at 6 px, which is right for the public pages and was
          the third corner in this bar.
        */}
        <SearchMenu rounded="control" />
      </Box>
    </ChakraProvider>
  );
};

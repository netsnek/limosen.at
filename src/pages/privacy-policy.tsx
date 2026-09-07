import { PageConfig, PageProps } from 'jaen';
import { Box, Container } from '@chakra-ui/react';
import { graphql } from 'gatsby';
import * as React from 'react';

import { useTOCContext } from '../contexts/toc';
import MdxEditor from '../components/mdx-editor/MdxEditor';

/**
 * The privacy policy is a long legal text with numbered sections, a table of
 * recipients and links, which is what the imprint's MDX field already holds and
 * what `Field.Editor` cannot hold: that field is a section list of heading,
 * text and image blocks, and it stood empty on both brands since the sites went
 * up, so nothing is lost by moving off it. Same shell as `imprint.tsx` so the
 * two legal pages read alike and the table of contents works on both.
 */
const PrivacyPolicyPage: React.FC<PageProps> = () => {
  const toc = useTOCContext();

  return (
    <Box as="main">
      <Container
        maxW="6xl"
        py={{ base: '6', md: '8', lg: '12' }}
        px={{ base: '4', md: '8', lg: '12' }}
      >
        <MdxEditor onMdast={toc.setValue} />
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;

export const pageConfig: PageConfig = {
  label: 'Privacy Policy',
  icon: 'FaPassport'
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`;

export { Head } from 'jaen';

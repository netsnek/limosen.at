import { PageConfig, PageProps } from 'jaen';

import { graphql } from 'gatsby';
import Everything from '../components/Everything';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <Everything />
    </>
  );
};


export default IndexPage;

export const pageConfig: PageConfig = {
  label: 'Home Page',
  icon: 'FaHome',
  childTemplates: ['BlogPage']
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
        childPages {
          ...JaenPageChildrenData
          sections {
            fieldName
            items {
              id
              jaenFields
            }
          }
        }
      }
    }
  }
`;

export { Head } from 'jaen';

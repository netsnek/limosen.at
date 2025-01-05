import { PageConfig, PageProps } from 'jaen';
import { Global } from '@emotion/react';

import { graphql } from 'gatsby';
import AboutUs from '../components/sections/AboutUs';
import Features from '../components/sections/Features';
import Hero from '../components/sections/Hero';
import PhotonQ from '../components/sections/PhotonQ';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import { Container, Box } from '@chakra-ui/react';
import Services from '../components/sections/Services';
import Mushroom from '../components/sections/Mushroom';
import Muffin from '../components/sections/Muffin';
import Special from '../components/sections/Special';
import Pains from '../components/sections/Pains';
import Sweets from '../components/sections/Sweets';
import LastCall from '../components/sections/LastCall';
import ServicesDetails from '../components/sections/ServiceDetails';
import Associates from '../components/sections/Associates';
import Portfolio from '../components/sections/Portfolio/Portfolio';
import { GoogleMaps } from '../components/GoogleMaps';
import Contact from '../components/sections/Contact';
import Customer from '../components/sections/Customer';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <Hero />
      {/* <ClientsMarquee w="full" /> */}
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
      }
    }
  }
`;

export { Head } from 'jaen';

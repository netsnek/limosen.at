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
      <GoogleMaps
        objectFit="cover"
        h="full"
        w="100%"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2740.0340435405824!2d14.295087575992476!3d46.626089555171056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47707481801f6b21%3A0x8399759ad0778c8f!2sSterneckstra%C3%9Fe%2023%2F20%2C%209020%20Klagenfurt%20am%20W%C3%B6rthersee!5e0!3m2!1sen!2sat!4v1718256423376!5m2!1sen!2sat"
      />
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

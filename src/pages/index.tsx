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
      {/* <Services />
      <ServicesDetails /> */}
      <GoogleMaps
        objectFit="cover"
        h="full"
        w="100%"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.943210509323!2d16.39061507721271!3d48.20770977125128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d0712a8ac8f77%3A0xefb15b7a09edac54!2sL%C3%B6wengasse%2028%2F22%2C%201030%20Wien!5e0!3m2!1sen!2sat!4v1748983411247!5m2!1sen!2sat"
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

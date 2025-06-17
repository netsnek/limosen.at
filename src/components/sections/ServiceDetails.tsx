import {
  Link,
  Box,
  Flex,
  Container,
  Heading,
  Text,
  chakra
} from '@chakra-ui/react';

import { StylizedImage } from '../StylizedImage';
import servicesSvg from '../../assets/images/services.svg';
import { Field } from 'jaen';

import { QASMPlayground } from '../main-content/qasm-playground/components/qasm-playground';

const Services = () => {
  return (
    <Box as="section">
      <Field.Text
        mt={{ base: '24', sm: '32', lg: '40' }}
        mb="8"
        as={Heading}
        fontSize={{ base: '4xl', lg: '5xl' }}
        lineHeight={1}
        fontWeight="bold"
        textAlign="left"
        name="SectionHeadingServiceDetails1"
        defaultValue='Ich unterstütze<br/><span style="color:var(--chakra-colors-brand-500)">High-Functioning-Autisten</span><br/> bei alltäglichen Herausforderungen<span style="color:var(--chakra-colors-brand-500)">.</span>'
      />

      <Container maxW="container.xl" mt="16">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="end"
        >
          <Box flex="1" textAlign="center" pr={{ lg: '12' }}>
            {/* Please replace `servicesSvg` with the source of your image or adjust as needed */}
            <StylizedImage
              sx={{
                filter:
                  'hue-rotate(180deg) saturate(1.3) brightness(1.1) contrast(0.9)'
              }}
              src={servicesSvg}
              boxSize={{ base: '31rem', lg: '41rem' }}
              m="auto"
            />
          </Box>
          <Box
            mt={{ base: '16', lg: '0' }}
            flex="1"
            minW={{ lg: '33rem' }}
            pl={{ lg: '4' }}
          >
            {/* For each ListItem you can create a custom component or structure here */}
            <Box mb="6">
              <Heading as="h4" size="md">
                Social Signals
              </Heading>
              <Text mt="2">
                Durch den Einsatz moderner UX-Methoden gestalten wir
                benutzerfreundliche und intuitive Oberflächen.
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Mimik und Körpewrsprache deuten
              </Heading>
              <Text mt="2">
                Wir kreieren moderne Websites und Webanwendungen, die exakt auf
                Ihre individuellen Bedürfnisse zugeschnitten sind.
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Raum lesen
              </Heading>
              <Text mt="2">
                Unsere maßgeschneiderten Backend-Lösungen werden speziell auf
                Ihre Anforderungen abgestimmt und basieren auf dem Framework{' '}
                <Link href="/jaen" textDecoration="underline">
                  Pylon
                </Link>
                .
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Sammeleigenschaften
              </Heading>
              <Text mt="2">
                Mit{' '}
                <Link href="/jaen" textDecoration="underline">
                  Jaen
                </Link>{' '}
                als Content-Management-System ermöglichen wir es Ihnen, Ihre
                Website eigenständig zu verwalten.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
      {/* <Field.Text
        mt={{ base: '24', sm: '32', lg: '40' }}
        mb="8"
        as={Heading}
        fontSize={{ base: '4xl', lg: '5xl' }}
        lineHeight={1}
        fontWeight="bold"
        textAlign="left"
        name="SectionHeadingServiceDetails2"
        defaultValue="Wir lösen<br/>
  <span style='color:var(--chakra-colors-brand-500)'>Ihr Probleme</span><br/>
  zur Not mit Quantencomputern<span style='color:var(--chakra-colors-brand-500)'>.</span>"
      />
      <QASMPlayground
        children={`// quantum ripple-carry adder from Cuccaro et al, quant-ph/0410184
  OPENQASM 2.0;
  include "qelib1.inc";
  gate majority a,b,c 
  { 
    cx c,b; 
    cx c,a; 
    ccx a,b,c; 
  }
  gate unmaj a,b,c 
  { 
    ccx a,b,c; 
    cx c,a; 
    cx a,b; 
  }
  qreg cin[1];
  qreg a[4];
  qreg b[4];
  qreg cout[1];
  creg ans[5];
  // set input states
  x a[0]; // a = 0001
  x b;    // b = 1111
  // add a to b, storing result in b
  majority cin[0],b[0],a[0];
  majority a[0],b[1],a[1];
  majority a[1],b[2],a[2];
  majority a[2],b[3],a[3];
  cx a[3],cout[0];
  unmaj a[2],b[3],a[3];
  unmaj a[1],b[2],a[2];
  unmaj a[0],b[1],a[1];
  unmaj cin[0],b[0],a[0];
  measure b[0] -> ans[0];
  measure b[1] -> ans[1];
  measure b[2] -> ans[2];
  measure b[3] -> ans[3];
  measure cout[0] -> ans[4];`}
      /> */}
    </Box>
  );
};

export default Services;

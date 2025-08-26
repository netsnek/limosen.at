import { PageConfig, PageProps } from 'jaen';
import { Global } from '@emotion/react';

import { graphql } from 'gatsby';
import AboutUs from '../components/sections/AboutUs';
import Features from '../components/sections/Features';
import RecipeHero from '../components/sections/RecipeHero';
import PhotonQ from '../components/sections/PhotonQ';
import ClientsMarquee from '../components/sections/ClientsMarquee';
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
import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
  AspectRatio,
  Container,
  chakra
} from '@chakra-ui/react'
import {Field, connectBlock, useSectionBlockContext} from 'jaen'
import {FC, useEffect, useState} from 'react'
import {Interface} from 'readline'
// import {CONTAINER_MAX_WIDTH} from '../../../../constant/sizes'
// import Shape1 from '../../../../common/assets/shapes/shape1.inline.svg'

interface IStepProps {
  isLeft: boolean
  position: number
}

interface IStepSectionProps {}

interface IStepsProps {
  image: string
  name: string
  qoute: string
  qualities: string[]
  isLeft: boolean
  role: string
  about: string
}

const Step: React.FC<IStepProps> = ({ isLeft, position }) => {
  // const [step, setStep] = useState<number>(position);

  // useEffect(() => {
  //   setStep(position);
  // }, [position]);

  return (
    <>
      <Flex
        justify={{ md: isLeft ? 'left' : 'right' }}
        py="8"
        display={{ base: 'none', md: 'flex' }}>
        <Flex
          align="center"
          flexDir={{ md: isLeft ? 'row' : 'row-reverse' }}
          flexGrow="1"
          gap="8"
          maxW="71.875rem"
          justify="space-between">
          <VStack flex="1">
            <Grid placeItems="center" pos="relative">
              <Field.Image name="image" />
            </Grid>
          </VStack>
          <Stack flex="1" borderLeft={"5px solid"} borderColor="brand.900" p="8">
            <Field.Text
              name="title"
              as={Heading}
              color="brand.900"
              size="24"
              fontWeight="semibold"
              textAlign={'left'}
              defaultValue={'Schritt ' + position}
              isDisabled
            />
            <Field.Text
              name="lead"
              fontWeight="semibold"
              color="gray.800"
              size="xl"
              textAlign={'left'}
              defaultValue={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'}
            />
            <Field.Text
              name="content"
              color="gray.900"
              textAlign={'left'}
              defaultValue={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
            />
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

export const StepsSection = connectBlock(
  () => {
      const blockContext = useSectionBlockContext()
      const position = blockContext!.position + 1

      console.log('position', blockContext)

      return (
          <Box
              pos={'relative'}
              pt={
                  position % 2 === 0
                      ? {
                          base: '20',
                          md: '32'
                      }
                      : {
                          base: '8',
                          md: '12'
                      }
              }
              pb={{
                  base: '12',
                  md: '20'
              }}
              //bgImage={blockContext!.position % 2 !== 0 ? '/images/about_us/thread1.svg' : undefined}
              bgImage={{
                  md: position % 3 === 0 ? '/images/about_us/side_shape.svg' : undefined
              }}
              bgRepeat="no-repeat"
              bgPos="right -8rem bottom 0"
              bgSize="20rem">
              {/* <Box
            top={position % 5 !== 0 ? { base: '-20', md: '-32' } : '0'}
            right={"0"}
            h={"100%"}
            w={"100%"}
            pos="absolute"
            bgImage={
              position % 5 === 0 
              ? '/images/about_us/shape_thread.svg' 
              : position % 2 === 0 
              ? '/images/about_us/thread1.svg' 
              : undefined
            }
            bgRepeat="no-repeat"
            bgPos={position % 5 !== 0 ? "0 -20px" : "0"}
            bgSize="contain"
          > */}
              <Box
                  top={{ base: '-20', md: '-32' }}
                  right={'0'}
                  h={'100%'}
                  w={'100%'}
                  bgImage={
                      position % 2 === 0 ? '/images/about_us/thread1.svg' : undefined
                  }
                  bgRepeat="no-repeat"
                  bgPos={'0 -20px'}
                  bgSize="contain"
                  pointerEvents="none"></Box>
              <Container maxW={'8xl'}>
                  <Step isLeft={blockContext!.position % 2 === 0} position={blockContext!.position} />
              </Container>
          </Box>
      )
  },
  {
      name: 'StepsSection',
      label: 'Step'
  }
)

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: '#dee9ec'
          }
        }}
      />
      <RecipeHero />
      <Container maxW="8xl" mb="20">
      <Flex alignItems={'start'} flexDir={{base: "column", md: "row"}}>
        <Box my="8" w={{base: "100%", md: "20%"}} mr={{base: "0", md: "16"}}>
          <Box p={16} bg="brand.900" borderRadius={"xl"} w={'full'}>
            <Heading color="white">Zutaten</Heading>
            <Text color="white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
          </Box>
          <Box my="8" p={16} bg="brand.900" borderRadius={"xl"} w={'full'}>
            <Heading color="white">Tipp</Heading>
            <Text color="white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
          </Box>
        </Box>
        <Box w="full">
        <Field.Section
          as={Stack}
          //props={{ spacing: 20, py: 8 }}
          // sectionProps={{
          //   py: {
          //     base: '12',
          //     md: '20'
          //   }
          // }}
          name="content"
          label="Content"
          blocks={[StepsSection]}
        />
          {/* <Flex flexDir={{base: "column", md: "row"}} borderRadius={"xl"} w={'full'}>
            <Heading>Step 1</Heading>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </Flex>
          <Flex flexDir={{base: "column", md: "row"}} borderRadius={"xl"} w={'full'}>
            <Heading>Step 2</Heading>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </Flex>
          <Flex flexDir={{base: "column", md: "row"}} borderRadius={"xl"} w={'full'}>
            <Heading>Step 3</Heading>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </Flex>
          <Flex flexDir={{base: "column", md: "row"}} borderRadius={"xl"} w={'full'}>
            <Heading>Step 4</Heading>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </Flex> */}
        </Box>
      </Flex>
      </Container>
      <LastCall />
      {/* <GoogleMaps
        objectFit="cover"
        h="full"
        w="100%"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2740.0340435405824!2d14.295087575992476!3d46.626089555171056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47707481801f6b21%3A0x8399759ad0778c8f!2sSterneckstra%C3%9Fe%2023%2F20%2C%209020%20Klagenfurt%20am%20W%C3%B6rthersee!5e0!3m2!1sen!2sat!4v1718256423376!5m2!1sen!2sat"
      /> */}
    </>
  );
};

export default IndexPage;

export const pageConfig: PageConfig = {
  label: 'Home Page',
  icon: 'FaHome',
  childTemplates: ['RecipePage']
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

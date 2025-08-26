import { connectBlock, Field, PageConfig, usePage, usePageContext, useSectionBlockContext } from 'jaen';
import { AspectRatio, Box, chakra, Container, Flex, Grid, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { PageProps, graphql } from 'gatsby';
import * as React from 'react';
import TableOfContent from '../components/navigation/TableOfContent';
import useNavOffset from '../hooks/use-nav-offset';
import MdxEditor from '../components/mdx-editor/MdxEditor';
import Links from '../components/Links';
import RightNav from '../components/navigation/RightNav';
import MainBottomNav from '../components/navigation/MainBottomNav';
import { Global } from '@emotion/react';
import RecipeHero from '../components/sections/RecipeHero';
import LastCall from '../components/sections/LastCall';
import { useEffect, useState } from 'react';
import Special from '../components/sections/Special';

// Example links - these would probably be fetched from a CMS or other data source
const links = [
  {
    name: 'Question? Give us feedback',
    href: '/contact'
  },
  {
    name: 'Edit this page on Jaen',
    href: '/cms/pages'
  }
];

interface IStepProps {
  isLeft: boolean
  position: number
}

interface IStepSectionProps { }

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
  return (
    <>
      <Flex
        justify={{ md: isLeft ? 'left' : 'right' }}
        py="8"
        // display={{ base: 'none', md: 'flex' }}
        display={'flex'}
      >
        <Flex
          align="center"
          flexDir={{ base: 'column', md: isLeft ? 'row' : 'row-reverse' }}
          flexGrow="1"
          gap="8"
          maxW="71.875rem"
          justify="space-between">
          <VStack flex="1" w="100%">
            <AspectRatio
              ratio={1}
              boxShadow="dark"
              w="75%"
              overflow="hidden"
              borderRadius="2xl"
            >
              <Field.Image name="image" />
            </AspectRatio>
            {/* <Grid placeItems="center" pos="relative">
              <AspectRatio
                ratio={1}
                pos="absolute"
                boxShadow="dark"
                overflow="hidden"
                isolation="isolate"
                w="75%"
                //borderRadius="full"
              >
                <Field.Image name="image" />
              </AspectRatio>
              <chakra.svg
                zIndex={100}
                pointerEvents="none"
                w="30rem"
                maxW="100%"
                h="auto"
                viewBox="0 0 809 678" // Adjusted for padding
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                sx={{
                  '#Selection': {
                    fill: '#f6f8fa'
                  }
                }}
              >
                <path id="Auswahl #1"
                  fill="#FFFFFF"
                  transform={"rotate("+ 54*position +" 400 300)"} // Rotate around the new center
                  d="M -208.00,-158.00
           C -208.00,-158.00 1010.00,-158.00 1010.00,-158.00
             1010.00,-158.00 1010.00,798.00 1010.00,798.00
             1010.00,798.00 -208.00,798.00 -208.00,798.00
             -208.00,798.00 -208.00,-158.00 -208.00,-158.00 Z
           M 332.00,82.14
           C 326.61,83.06 326.37,82.99 321.00,83.00
             321.00,83.00 283.00,86.28 283.00,86.28
             227.50,93.59 167.95,109.50 132.23,156.00
             110.00,184.95 99.43,221.01 96.91,257.00
             96.91,257.00 96.00,267.00 96.00,267.00
             95.63,298.85 99.91,328.62 109.74,359.00
             137.10,443.50 207.72,513.22 291.00,542.69
             311.58,549.97 344.28,557.74 366.00,558.00
             366.00,558.00 383.00,559.00 383.00,559.00
             383.00,559.00 405.00,558.00 405.00,558.00
             417.22,557.98 438.63,554.81 451.00,552.58
             525.82,539.06 601.24,497.15 647.11,436.00
             663.86,413.67 675.29,391.81 685.60,366.00
             695.48,341.28 703.69,307.64 704.00,281.00
             704.00,281.00 704.99,269.00 704.99,269.00
             704.99,269.00 704.09,257.00 704.09,257.00
             701.58,220.30 693.91,189.86 669.56,161.00
             649.87,137.66 621.19,122.21 593.00,111.58
             548.88,94.93 500.80,88.13 454.00,84.91
             454.00,84.91 423.00,83.00 423.00,83.00
             423.00,83.00 407.00,82.14 407.00,82.14
             407.00,82.14 332.00,82.14 332.00,82.14 Z" />
              </chakra.svg>
            </Grid> */}
          </VStack>
          <Stack
            flex="1"
            borderColor="brand.900"
            p="8"
            borderLeft="5px solid"
          //borderLeft={isLeft ? "5px solid" : "none"}
          //borderRight={isLeft ? "none" : "5px solid"}
          >
            <Text
              as={Heading}
              color="brand.900"
              size="24"
              fontWeight="semibold"
              textAlign={'left'}
            >{'Schritt ' + position}</Text>
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
    const isLeft = position % 2 !== 0

    console.log('position', blockContext)

    return (
      <Box
        pos={'relative'}
        pt={
          isLeft
            ? {
              base: '12',
              md: '16'
            }
            : {
              base: '8',
              md: '12'
            }
        }
        pb={{
          base: '4',
          md: '8'
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
            isLeft ? '/images/about_us/thread1.svg' : undefined
          }
          bgRepeat="no-repeat"
          bgPos={'0 -20px'}
          bgSize="contain"
          pointerEvents="none"></Box>
        <Container maxW={'8xl'}>
          <Step isLeft={isLeft} position={position} />
        </Container>
      </Box>
    )
  },
  {
    name: 'StepsSection',
    label: 'Step'
  }
)

const RecipePage: React.FC<PageProps> = props => {
  //const {jaenPage} = usePageContext()
  const jaenPage = usePage()
  console.log('!!All page data', jaenPage)
  return (
    <>
      <RecipeHero defaultHeading={jaenPage?.jaenPageMetadata?.title || ""} defaultLead={jaenPage?.jaenPageMetadata?.description || ""} defautlImage={jaenPage?.jaenPageMetadata?.image || ""} />
      <Container maxW="8xl" mb="20">
        <Flex alignItems={'start'} flexDir={{ base: "column", md: "row" }}>
          <Box my="8" w={{ base: "100%", md: "20%" }} mr={{ base: "0", md: "16" }}>
            <Box p={8} bg="brand.900" borderRadius={"xl"} w={'full'}>
              <Heading pb="4" color="white">Zutaten</Heading>
              <Field.Text name="ingredientsText" color="white" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
            </Box>
            <Box my="8" p={8} bg="brand.900" borderRadius={"xl"} w={'full'}>
              <Heading pb="4" color="white">Tipp</Heading>
              <Field.Text name="tippText" color="white" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
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
      {/* <LastCall /> */}
      <Special />
      {/* <GoogleMaps
            objectFit="cover"
            h="full"
            w="100%"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2740.0340435405824!2d14.295087575992476!3d46.626089555171056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47707481801f6b21%3A0x8399759ad0778c8f!2sSterneckstra%C3%9Fe%2023%2F20%2C%209020%20Klagenfurt%20am%20W%C3%B6rthersee!5e0!3m2!1sen!2sat!4v1718256423376!5m2!1sen!2sat"
          /> */}
    </>
  );
};

export default RecipePage;

export { Head } from 'jaen';

export const pageConfig: PageConfig = {
  label: 'RecipePage',
  childTemplates: ['RecipePage'],
  withoutJaenFrameStickyHeader: true
};

export const query = graphql`
  query ($jaenPageId: String!) {
    jaenPage(id: { eq: $jaenPageId }) {
      ...JaenPageData
      childPages {
        ...JaenPageChildrenData
      }
    }
  }
`;

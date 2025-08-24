import {
  Box,
  Image,
  Container,
  Flex,
  Text,
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
  Heading,
  Button,
  chakra, // <-- make sure this is imported (it already is in your code)
  Link,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

import { useMemo, FC } from 'react';

import MountainSVG from '../MountainSvg';
import SynthwaveSVG from './SynthwaveSVG';

import { useScrollSync } from '../../hooks/use-scroll-sync';
import * as style from './style';
import { useRecipePages } from '../../hooks/use-recipe-pages';
import { useJaenProducts } from '../../hooks/use-products';
import ProductIndex from '../ProductIndex';
import { usePage } from 'jaen';
import Services from '../sections/Services';
import ServicesDetails from '../sections/ServiceDetails';

export interface ParallaxHeroProps {
  noScroll?: boolean;
}

// 1) Define your “scrolling potential” in PX (child bigger by this much)
const SCROLLING_POTENTIAL_PX = 500;

// Example props for your slider
interface INewsSlidesProps {
  productIndex?: any;
  showNewsTitle?: boolean;
}

const move = keyframes`
  0% { transform: translate(0, -50%); }
  100% { transform: translate(0, 0); }
`;

const RecipeSlider: FC<INewsSlidesProps> = ({
  productIndex,
  showNewsTitle
}) => {
  console.log('!!All index data', productIndex);
  const cmsmediapage = usePage({
    id: 'JaenPage /cms/media/',
    injectMedia: true
  });
  console.log('!!All media data', cmsmediapage);
  const { products, featuredProducts, moreProducts, abcProducts } =
    useJaenProducts(productIndex, cmsmediapage);

  console.log('!!All products data', products);
  return (
    <Box as="section">
      {/* <PortfolioGrid
        products={products}
        display={{ base: 'none', sm: 'grid' }}
        mt="16"
      /> */}
      <ProductIndex
        featuredProducts={featuredProducts}
        abcProducts={abcProducts}
        pt="16"
      />
      {/* Form mobile */}
      {/* <PortfolioSlider index={index} display={{base: 'block', sm: 'none'}} /> */}
    </Box>
  );
};

export const ParallaxHero: FC<ParallaxHeroProps> = ({ noScroll }) => {
  const { ref, scrollTop } = useScrollSync(0);
  const CONTAINER_MAX_WIDTH = '87.5rem';
  const productIndex = useRecipePages();

  return (
    <>
      <Box
        className="parallax"
        css={style.Section(noScroll)}
        ref={ref}
        mb={`-${SCROLLING_POTENTIAL_PX}px`}
        //mt={{ base: '3.5rem', md: '4rem', lg: '8rem' }}
        //height="500vh"
        //pb={{ base: 'calc(150vh - 7.5rem)', lg: 'calc(150vh - 8rem)' }}
      >
        {/* <Box className="parallax__layer parallax__layer__0">
          <MountainSVG
            position="absolute"
            top={'0'}
            left={'0'}
            w={'100%'}
            seed={98765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            topOffset={256}
            bottomOffset={0}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#400542"
          />
          <SynthwaveSVG position={'absolute'} top={'100'} left={'0'} />
        </Box> */}
        <Box
          /* .layer */
          className="parallax__layer parallax__layer__0"
          display="flex"
          h="160vh"
          alignItems="center"
          justifyContent="center"
          bg="#fff"
          overflow="hidden"
          fontFamily="cursive"
          m={0}
          pos="relative"
          sx={{ perspective: '100vmax' }}
        >
          <Box
            /* .scene */
            pos="relative"
            h="150vh"
            w="100vw"
            transform="scale(1)"
            sx={{ transformStyle: 'preserve-3d' }}
          >
            <Box
              /* .wall-grid */
              pos="absolute"
              sx={{ inset: 0 }}
              zIndex={0}
              sx={{
                inset: 0,
                '--grid-color': 'rgba(0, 0, 0, 0.2)',
                '--grid-weight': '3.15px',
                '--grid-spacing': '3.65vmax',
                '--grid-glow': '10px',
                '--grid-glow-color': 'rgba(0, 0, 0, 0)',
                '--grid-col': 'var(--grid-spacing)',
                '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
                backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
                backgroundSize:
                  'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
                backgroundImage: `
              repeating-linear-gradient(
                0deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-row)
              ),
              repeating-linear-gradient(
                0deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-row) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-row)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-col)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-col) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-col)
              )
            `,
                transform: 'translateZ(-45vmax) scale(1.6)'
              }}
            />

            <Box
              /* .floor-grid */
              bg="white"
              pos="absolute"
              top="50%"
              left="50%"
              h="100vmax"
              w="180vw"
              transform="translate(-50%, -50%) rotate3d(1, 0, 0, 75deg) translate3d(0, 25%, 0)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="30vmin"
              overflow="hidden"
              zIndex={1}
              sx={{
                willChange: 'transform',
                '--grid-color': 'rgba(0, 0, 0, 0.2)',
                '--grid-weight': '5px',
                '--grid-spacing': '5vmax',
                '--grid-glow': '10px',
                '--grid-glow-color': 'rgba(0, 0, 0, 0)',
                '--grid-col': 'var(--grid-spacing)',
                '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
                textShadow: `
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 15px #fff,
              0 0 20px var(--grid-color),
              0 0 35px var(--grid-color),
              0 0 40px var(--grid-color),
              0 0 50px var(--grid-color),
              0 0 75px var(--grid-color)
            `,
                '&::before': {
                  content: '""',
                  zIndex: -1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '200%',
                  width: '100%',
                  backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
                  backgroundSize:
                    'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
                  backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  var(--grid-color),
                  var(--grid-color) var(--grid-weight),
                  transparent var(--grid-weight),
                  transparent var(--grid-row)
                ),
                repeating-linear-gradient(
                  0deg,
                  var(--grid-glow-color),
                  var(--grid-glow-color) var(--grid-weight),
                  transparent calc(var(--grid-weight) + var(--grid-glow)),
                  transparent calc(var(--grid-row) - var(--grid-glow)),
                  var(--grid-glow-color) var(--grid-row)
                ),
                repeating-linear-gradient(
                  -90deg,
                  var(--grid-color),
                  var(--grid-color) var(--grid-weight),
                  transparent var(--grid-weight),
                  transparent var(--grid-col)
                ),
                repeating-linear-gradient(
                  -90deg,
                  var(--grid-glow-color),
                  var(--grid-glow-color) var(--grid-weight),
                  transparent calc(var(--grid-weight) + var(--grid-glow)),
                  transparent calc(var(--grid-col) - var(--grid-glow)),
                  var(--grid-glow-color) var(--grid-col)
                )
              `,
                  animation: `${move} 20s linear infinite`
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0
                }
              }}
            />
          </Box>

          {/* If you also need the optional .cover element, uncomment this:
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        bg="white"
        h="70vh"
        w="100vw"
        borderTop="5px solid black"
      />
      */}
        </Box>

        <Box className="parallax__layer parallax__layer__1">
          {/* <MountainSVG
            position="absolute"
            top={'0'}
            w={"100%"}
            seed={765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            topOffset={256}
            bottomOffset={0}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#26072a"
          /> */}
        </Box>

        <Box className="parallax__layer parallax__layer__2">
          {/* <MountainSVG
            position="absolute"
            top={'0'}
            left={'0'}
            w={"100%"}
            seed={9765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            topOffset={256}
            bottomOffset={0}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#1e0521"
          /> */}

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              as="section"
              py={{ base: 12, md: 20 }}
              px={{ base: 6, md: 10 }}
            >
              <VStack align="flex-start" spacing={{ base: 5, md: 6 }}>
                <Heading
                  as="h1"
                  fontSize={{ base: '2xl', md: '4xl' }}
                  lineHeight="1.1"
                >
                  PSYCHOTHERAPIE & PSYCHOANALYSE
                </Heading>

                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color="gray.700"
                  maxW="60ch"
                >
                  Nadine Hauswirth, BA. Pth – Psychotherapeutin in Ausbildung
                  unter Supervision und Psychoanalyse in Wien
                </Text>

                <HStack spacing={4} pt={2}>
                  <Button size="lg" variant="outline" borderRadius="full">
                    Kontakt
                  </Button>
                  <Button size="lg" borderRadius="full">
                    Termin buchen
                  </Button>
                </HStack>
              </VStack>
            </Box>
            <LinkBox
              as="article"
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                '&:hover .hoverUnderline': {
                  textDecoration: 'underline'
                }
              }}
            >
              <LinkOverlay href="/blog" _hover={{ textDecoration: 'none' }}>
                <Image
                  mb={4}
                  height="300px"
                  mx={16}
                  mt={16}
                  borderRadius={'20%'}
                  src="/content/Nadine.jpeg"
                  alt="DarkMountainIMG"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' }
                    },
                    animation: 'float 4s ease-in-out infinite',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      animation: 'none',
                      transform: 'translateY(-10px)'
                    },
                    '&:not(:hover)': {
                      animation: 'float 4s ease-in-out infinite 0.5s',
                      transform: 'translateY(0)'
                    }
                  }}
                />
                <Box
                  className="hoverUnderline"
                  fontWeight="bold"
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                  display={'none'}
                >
                  BLOG
                </Box>
              </LinkOverlay>
            </LinkBox>
          </Box>
        </Box>

        <Box
          className="parallax__layer parallax__layer__3"
          pointerEvents={'none'}
        >
          {/* This layer is blank in your code */}
        </Box>

        {/*
          2) Instead of a fixed height of "3000px",
             make the child bigger than the parent by 1 × SCROLLING_POTENTIAL_PX
             using padding + negative margin.
        */}
        <Box
          className="parallax__layer__6"
          mt={`${SCROLLING_POTENTIAL_PX}px`}
          // Remove or override the fixed height:
          // h="3000px"
          position="relative"
        >
          <Box
            // Child is bigger by SCROLLING_POTENTIAL_PX:
            pb={`${SCROLLING_POTENTIAL_PX}px`}
            mb={`-${SCROLLING_POTENTIAL_PX}px`}
            position="relative"
          >
            <Box opacity={0}>
              <Image
                src="/content/synthwave/shinobu4.png"
                alt="DarkMountainIMG"
              />
            </Box>

            <Box
              bg="#18011a"
              //bg={"white"}
              h={'100%'}
            >
              <Box h="20"></Box>
              <Container
                maxW={'5xl'}
                mt="0"
                py="8"
                px={8}
                bg={'white'}
                borderRadius={'xl'}
              >
                {/* <RecipeSlider productIndex={productIndex} /> */}
                <Services />
                <ServicesDetails />
              </Container>
              <Box h="20"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

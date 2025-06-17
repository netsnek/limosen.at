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
  chakra,
  Link,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';
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
        <Box className="parallax__layer parallax__layer__0">
          {/* <MountainSVG
            position="absolute"
            top={'0'}
            left={'0'}
            w={"100%"}
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
          /> */}
          <SynthwaveSVG position={'absolute'} top={'100'} left={'0'} />
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

            <Box
              w={'50%'}
              maxW={CONTAINER_MAX_WIDTH}
              px={4}
              py={8}
              bg={'white'}
              borderRadius="20%"
              boxShadow="lg"
              zIndex={1}
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
            >
              <Text
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="bold"
                textAlign="center"
                color="black"
                mb={4}
              >
                Dem Verstand auf der Spur
              </Text>
              <Text
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color="black"
                mb={8}
              >
                Nadine Hauswirth, BA. Pth Psychotherapeutin in Ausbildung unter
                Supervision und Psychoanalyse in Wien, Behandlung von
                Prokrastination, Depression, Ängsten, Zwängen, Verzweiflung,
                Problemen in der Beziehung, psychosomatische Beschwerden.
              </Text>
              {/* <Flex justifyContent="center">
                <Link
                  href="/blog"
                  fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                  color="teal.500"
                  fontWeight="bold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Visit Our Blog
                </Link>
              </Flex> */}
            </Box>
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

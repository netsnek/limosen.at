import { keyframes } from '@emotion/react';
import {
  Box, Image, Container, Text, HStack, VStack, Heading, Button,
  LinkBox, LinkOverlay
} from '@chakra-ui/react';
import { FC } from 'react';
import { useScrollSync } from '../../hooks/use-scroll-sync';
import * as style from './style';
import Services from '../sections/Services';
import ServicesDetails from '../sections/ServiceDetails';
import { useRecipePages } from '../../hooks/use-recipe-pages';
import { usePage } from 'jaen';

export interface ParallaxHeroProps { noScroll?: boolean; }
const SCROLLING_POTENTIAL_PX = 500;

const move = keyframes`
  0% { transform: translate(0, -50%); }
  100% { transform: translate(0, 0); }
`;

export const ParallaxHero: FC<ParallaxHeroProps> = ({ noScroll }) => {
  const { ref } = useScrollSync(0);
  const productIndex = useRecipePages();
  usePage({ id: 'JaenPage /cms/media/', injectMedia: true }); // unchanged

  // Brand palette
  // const BRAND = {
  //   base: '#ffffffff',
  //   accent: '#7f188c',
  //   white: '#ffffffff',
  //   // derived
  //   gridLine: 'rgba(0, 0, 0, 0.65)',   // #7f188c
  //   gridGlow: 'rgba(0, 0, 0, 0.65)', // white glow for modern look
  // };
    // Brand palette
  const BRAND = {
    base: '#18011a',
    accent: '#7f188c',
    white: '#ffffffff',
    // derived
    gridLine: 'rgba(127, 24, 140, 0.65)',   // #7f188c
    gridGlow: 'rgba(127, 24, 140, 0.65)', // white glow for modern look
  };

  return (
    <Box className="parallax" css={style.Section(noScroll)} ref={ref} mb={`-${SCROLLING_POTENTIAL_PX}px`}>
      {/* BACKDROP LAYER */}
      <Box
        className="parallax__layer parallax__layer__0"
        display="flex"
        h="160vh"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        fontFamily="cursive"
        m={0}
        pos="relative"
        sx={{
          perspective: '100vmax',
          // Subtle futuristic spotlight in brand accent over deep base
          background: `
            radial-gradient(120% 70% at 50% 0%,
              rgba(127,24,140,0.25) 0%,
              rgba(127,24,140,0.08) 40%,
              rgba(24,1,26,0) 70%
            ),
            ${BRAND.base}
          `
        }}
        // sx={{
        //   perspective: '100vmax',
        //   // Subtle futuristic spotlight in brand accent over deep base
        //   background: `
        //     radial-gradient(120% 70% at 50% 0%,
        //       rgba(255, 255, 255, 0.25) 0%,
        //       rgba(255, 255, 255, 0.08) 40%,
        //       rgba(24,1,26,0) 70%
        //     ),
        //     ${BRAND.base}
        //   `
        // }}
      >
        <Box pos="relative" h="150vh" w="100vw" transform="scale(1)" sx={{ transformStyle: 'preserve-3d' }}>
          {/* WALL — slim grid, white glow; more visible at bottom */}
          <Box
            pos="absolute"
            zIndex={0}
            sx={{
              inset: 0,
              '--grid-color': BRAND.gridLine,
              '--grid-weight': '1px',
              '--grid-spacing': '3.65vmax',
              '--grid-glow': '2px',
              '--grid-glow-color': BRAND.gridGlow,
              '--grid-col': 'var(--grid-spacing)',
              '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
              backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
              backgroundSize:
                'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
              backgroundImage: `
                /* horizontals */
                repeating-linear-gradient(
                  0deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                  transparent var(--grid-weight), transparent var(--grid-row)
                ),
                /* horizontal glow (white) */
                repeating-linear-gradient(
                  0deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                  transparent calc(var(--grid-weight) + var(--grid-glow)),
                  transparent calc(var(--grid-row) - var(--grid-glow)),
                  var(--grid-glow-color) var(--grid-row)
                ),
                /* verticals */
                repeating-linear-gradient(
                  -90deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                  transparent var(--grid-weight), transparent var(--grid-col)
                ),
                /* vertical glow */
                repeating-linear-gradient(
                  -90deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                  transparent calc(var(--grid-weight) + var(--grid-glow)),
                  transparent calc(var(--grid-col) - var(--grid-glow)),
                  var(--grid-glow-color) var(--grid-col)
                )
              `,
              backgroundBlendMode: 'screen',
              transform: 'translateZ(-45vmax) scale(1.6)',
              // Stronger at bottom, fades toward top
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* FLOOR — slim, precise, professional; white-ish glow keeps it clean */}
          <Box
            bg={BRAND.base}
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
              '--grid-color': BRAND.gridLine,
              '--grid-weight': '1.1px',
              '--grid-spacing': '5vmax',
              '--grid-glow': '2.5px',
              '--grid-glow-color': BRAND.gridGlow,
              '--grid-col': 'var(--grid-spacing)',
              '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
              textShadow: `
                0 0 1px ${BRAND.white},
                0 0 3px ${BRAND.white},
                0 0 8px var(--grid-color)
              `,
              '&::before': {
                content: '""',
                zIndex: -1,
                position: 'absolute',
                top: 0, left: 0,
                height: '200%', width: '100%',
                backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
                backgroundSize:
                  'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                    transparent var(--grid-weight), transparent var(--grid-row)
                  ),
                  repeating-linear-gradient(
                    0deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                    transparent calc(var(--grid-weight) + var(--grid-glow)),
                    transparent calc(var(--grid-row) - var(--grid-glow)),
                    var(--grid-glow-color) var(--grid-row)
                  ),
                  repeating-linear-gradient(
                    -90deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                    transparent var(--grid-weight), transparent var(--grid-col)
                  ),
                  repeating-linear-gradient(
                    -90deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                    transparent calc(var(--grid-weight) + var(--grid-glow)),
                    transparent calc(var(--grid-col) - var(--grid-glow)),
                    var(--grid-glow-color) var(--grid-col)
                  )
                `,
                backgroundBlendMode: 'screen',
                animation: `${move} 20s linear infinite`
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                // subtle white horizon bloom for cleanliness
                background:
                  'radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 55%)',
              }
            }}
          />
        </Box>
      </Box>

      {/* CONTENT LAYER — professional white surface with accent details */}
      <Box className="parallax__layer parallax__layer__2">
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
          <Box as="section" py={{ base: 12, md: 20 }} px={{ base: 6, md: 10 }}>
            <VStack align="flex-start" spacing={{ base: 5, md: 6 }}>
              <Heading as="h1" fontSize={{ base: '2xl', md: '4xl' }} lineHeight="1.1" color={BRAND.white}>
                PSYCHOTHERAPIE &amp; PSYCHOANALYSE
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.900" maxW="60ch">
                Nadine Hauswirth, BA. Pth – Psychotherapeutin in Ausbildung unter Supervision und Psychoanalyse in Wien
              </Text>
              <HStack spacing={4} pt={2}>
                <Button
                  size="lg"
                  variant="outline"
                  borderRadius="full"
                  borderColor={BRAND.white}
                  color={BRAND.white}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  Kontakt
                </Button>
                <Button
                  size="lg"
                  borderRadius="full"
                  bg={BRAND.accent}
                  color="white"
                  _hover={{ filter: 'brightness(1.1)' }}
                >
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
            sx={{ '&:hover .hoverUnderline': { textDecoration: 'underline' } }}
          >
            <LinkOverlay href="/blog" _hover={{ textDecoration: 'none' }}>
              <Image
                mb={4} height="300px" mx={16} mt={16} borderRadius="20%"
                src="/content/Nadine.jpeg" alt="Nadine"
                sx={{
                  '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
                  animation: 'float 4s ease-in-out infinite',
                  transition: 'transform 0.5s ease-in-out',
                  '&:hover': { animation: 'none', transform: 'translateY(-10px)' },
                  '&:not(:hover)': { animation: 'float 4s ease-in-out infinite 0.5s', transform: 'translateY(0)' }
                }}
              />
              <Box className="hoverUnderline" fontWeight="bold" textDecoration="none" display="none">
                BLOG
              </Box>
            </LinkOverlay>
          </LinkBox>
        </Box>
      </Box>

      {/* WHITE CONTENT AREA BELOW (clean & professional) */}
      <Box className="parallax__layer__6" mt={`${SCROLLING_POTENTIAL_PX}px`} position="relative">
        <Box pb={`${SCROLLING_POTENTIAL_PX}px`} mb={`-${SCROLLING_POTENTIAL_PX}px`} position="relative">
          <Box opacity={0}>
            <Image src="/content/synthwave/shinobu4.png" alt="" />
          </Box>

          <Box bg={"white"} h="100%">
            <Box h="20" />
            <Container
              maxW="5xl"
              mt="0"
              py="10"
              px={8}
              bg={BRAND.white}
              color={BRAND.base}
              borderRadius="xl"
              boxShadow="0 10px 40px rgba(0,0,0,0.25)"
              border="1px solid"
              borderColor="rgba(127,24,140,0.15)"
            >
              <Services />
              <ServicesDetails />
            </Container>
            <Box h="20" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

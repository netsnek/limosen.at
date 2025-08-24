// ParallaxHero.tsx
import { keyframes } from '@emotion/react';
import {
  Box,
  Image,
  Container,
  Text,
  HStack,
  VStack,
  Heading,
  Button,
  LinkBox,
  LinkOverlay,
  Flex,
  AspectRatio,
  chakra,
  Link,
  VisuallyHidden
} from '@chakra-ui/react';
import { FC } from 'react';
import { useScrollSync } from '../../hooks/use-scroll-sync';
import * as style from './style';
import Services from '../sections/Services';
import ServicesDetails from '../sections/ServiceDetails';
import { useRecipePages } from '../../hooks/use-recipe-pages';
import BlogSlider from '../sections/BlogSlider';
import { useJaenPageIndex, usePage } from 'jaen';

// Social icons
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin';
import { FaGithub } from '@react-icons/all-files/fa/FaGithub';
import { FaTiktok } from '@react-icons/all-files/fa6/FaTiktok';

// New sections
import AchivementCounter from '../sections/AchivementCounter';
import ChangeCoaching from '../sections/ChangeCoaching';
import Psychotherapy from '../sections/Psychotherapy';
import NonDisclosure from '../sections/NonDisclosure';
import Prices from '../sections/Prices';
import Associates from '../sections/Associates';
import useBlogPages from '../../hooks/use-blogs';
import FAQ from '../sections/FAQ';

// ------------------------------------
// Parallax Hero
// ------------------------------------
export interface ParallaxHeroProps {
  noScroll?: boolean;
}
const SCROLLING_POTENTIAL_PX = 500;

const move = keyframes`
  0% { transform: translate(0, -50%); }
  100% { transform: translate(0, 0); }
`;

// Liquid-glass internals
const blob = keyframes`
  0% { transform: translate(-6%, -4%) scale(1); }
  38% { transform: translate(8%, -10%) scale(1.05); }
  72% { transform: translate(-4%, 6%) scale(1.08); }
  100% { transform: translate(6%, 2%) scale(1.12); }
`;

const sheen = keyframes`
  0% { transform: translateX(-120%) rotate(15deg); }
  100% { transform: translateX(120%) rotate(15deg); }
`;

export const ParallaxHero: FC<ParallaxHeroProps> = ({ noScroll }) => {
  const { ref } = useScrollSync(0);
  const blogIndex = useBlogPages();
  
  // Brand palette
  const BRAND = {
    base: '#18011a',
    accent: '#7f188c',
    white: '#ffffffff',
    gridLine: 'rgba(127, 24, 140, 0.65)',
    gridGlow: 'rgba(127, 24, 140, 0.65)'
  };

  const MODERN_FONT =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'";

  return (
    <Box className="parallax" css={style.Section(noScroll)} ref={ref} mb={`-${SCROLLING_POTENTIAL_PX}px`}>
      {/* BACKDROP LAYER — DO NOT CHANGE */}
      <Box
        className="parallax__layer parallax__layer__0"
        display="flex"
        h="160vh"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        m={0}
        pos="relative"
        sx={{
          perspective: '100vmax',
          background: `
            radial-gradient(120% 70% at 50% 0%,
              rgba(127,24,140,0.25) 0%,
              rgba(127,24,140,0.08) 40%,
              rgba(24,1,26,0) 70%
            ),
            ${BRAND.base}
          `
        }}
      >
        <Box pos="relative" h="150vh" w="100vw" transform="scale(1)" sx={{ transformStyle: 'preserve-3d' }}>
          {/* WALL */}
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
              transform: 'translateZ(-45vmax) scale(1.6)',
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)'
            }}
          />

          {/* FLOOR */}
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
                top: 0,
                left: 0,
                height: '200%',
                width: '100%',
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
                background:
                  'radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 55%)'
              }
            }}
          />
        </Box>
      </Box>

      {/* CONTENT LAYER */}
      <Box className="parallax__layer parallax__layer__2">
        <Container maxW="7xl" py={{ base: 6, md: 10 }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'center', md: 'stretch' }}
            gap={{ base: 6, md: 10 }}
            justify="space-between"
          >
            {/* Mobile: circular avatar link */}
            <LinkBox as="article" display={{ base: 'block', md: 'none' }} position="relative">
              <LinkOverlay href="/blog" aria-label="Zum Blog" />
              <Box
                position="relative"
                w="140px"
                h="140px"
                borderRadius="full"
                overflow="hidden"
                border="2px solid rgba(255,255,255,0.35)"
                boxShadow="0 10px 30px rgba(0,0,0,0.35)"
              >
                <Image
                  src="/content/IMG_3038.jpg"
                  alt="Nadine Hauswirth, Psychotherapeutin"
                  w="full"
                  h="full"
                  objectFit="cover"
                  loading="lazy"
                />
                <Box
                  
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-br, rgba(255,255,255,0.18), rgba(255,255,255,0))"
                />
              </Box>
            </LinkBox>

            {/* Desktop: framed portrait link */}
            <LinkBox
              as="article"
              display={{ base: 'none', md: 'block' }}
              flexBasis={{ md: '380px', lg: '420px' }}
              alignSelf={{ md: 'flex-start' }}
              position="relative"
            >
              <LinkOverlay href="/blog" aria-label="Zum Blog" _hover={{ textDecoration: 'none' }} />
              <Box
                p="2px"
                borderRadius="28px"
                transition="transform 0.3s ease, box-shadow 0.3s ease"
                bgGradient={`linear(to-br, ${BRAND.accent}, rgba(255,255,255,0.9))`}
                boxShadow="0 16px 60px rgba(127,24,140,0.35)"
                _hover={{ transform: 'translateY(-4px)', boxShadow: '0 24px 80px rgba(127,24,140,0.5)' }}
                maxW="420px"
                w="full"
              >
                <Box
                  bg={BRAND.base}
                  borderRadius="26px"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.28)"
                  p="10px"
                  overflow="hidden"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    borderRadius: '22px',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -20px 40px rgba(0,0,0,0.25)'
                  }}
                >
                  {/* Match image native ratio ~1463x1736 ≈ 5:6 */}
                  <AspectRatio ratio={5 / 6} w="full">
                    <Image
                      src="/content/IMG_3038.jpg"
                      alt="Nadine Hauswirth, Psychotherapeutin"
                      borderRadius="22px"
                      objectFit="cover"
                      objectPosition="center top"
                      loading="lazy"
                    />
                  </AspectRatio>
                </Box>
              </Box>
            </LinkBox>

            {/* Liquid Glass Panel */}
            <Box
              flex="1"
              maxW={{ base: '720px', lg: '820px' }}
              w="full"
              position="relative"
              borderRadius="2xl"
              px={{ base: 5, md: 8 }}
              py={{ base: 6, md: 8 }}
              bg="rgba(255,255,255,0.06)"
              border="1px solid rgba(255,255,255,0.22)"
              boxShadow="0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.22)"
              backdropFilter="blur(16px) saturate(130%)"
              sx={{
                WebkitBackdropFilter: 'blur(16px) saturate(130%)',
                overflow: 'hidden',
                isolation: 'isolate',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: '-20%',
                  background: `radial-gradient(40% 40% at 20% 10%, rgba(127,24,140,0.28) 0%, rgba(127,24,140,0.00) 60%),
                     radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 60%),
                     radial-gradient(50% 50% at 60% 80%, rgba(127,24,140,0.18) 0%, rgba(127,24,140,0.00) 60%)`,
                  filter: 'blur(24px)',
                  animation: `${blob} 36s ease-in-out infinite`,
                  zIndex: -2,
                  pointerEvents: 'none',
                  mixBlendMode: 'screen'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-30%',
                  left: '-10%',
                  width: '140%',
                  height: '200%',
                  background:
                    'linear-gradient(120deg, rgba(255,255,255,0) 45%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0) 55%)',
                  animation: `${sheen} 18s linear infinite`,
                  pointerEvents: 'none',
                  zIndex: -1
                }
              }}
            >
              <Box position="relative" zIndex={1}>
                <VStack align="flex-start" spacing={{ base: 4, md: 5 }}>
                  <Heading
                    as="h1"
                    fontFamily={MODERN_FONT}
                    fontWeight="800"
                    letterSpacing="-0.02em"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    lineHeight="1.15"
                    color={BRAND.white}
                  >
                    COACHING &amp; PSYCHOTHERAPIE
                  </Heading>

                  <Text
                    fontFamily={MODERN_FONT}
                    fontWeight="500"
                    letterSpacing="0.01em"
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="whiteAlpha.900"
                    maxW="60ch"
                  >
                    Nadine Hauswirth, BA. Pth – Psychotherapeutin in Ausbildung
                    unter Supervision und Psychoanalyse in Wien
                  </Text>

                  <HStack spacing={3} pt={1} flexWrap="wrap">
                    <Button
                      size="md"
                      variant="outline"
                      borderRadius="full"
                      borderColor={BRAND.white}
                      color={BRAND.white}
                      _hover={{ bg: 'whiteAlpha.100' }}
                      _focusVisible={{ boxShadow: '0 0 0 3px rgba(127,24,140,0.45)' }}
                    >
                      Kontakt
                    </Button>
                    <Button
                      size="md"
                      borderRadius="full"
                      bg={BRAND.accent}
                      color="white"
                      _hover={{ filter: 'brightness(1.1)' }}
                      _focusVisible={{ boxShadow: '0 0 0 3px rgba(127,24,140,0.45)' }}
                    >
                      Termin buchen
                    </Button>

                    <HStack spacing={3} pl={{ base: 0, md: 2 }}>
                      <Link href="#" isExternal aria-label="TikTok">
                        <VisuallyHidden>TikTok</VisuallyHidden>
                        <Box as={FaTiktok} boxSize="22px" color="whiteAlpha.900" />
                      </Link>
                      <Link href="#" isExternal aria-label="LinkedIn">
                        <VisuallyHidden>LinkedIn</VisuallyHidden>
                        <Box as={FaLinkedin} boxSize="22px" color="whiteAlpha.900" />
                      </Link>
                      <Link href="#" isExternal aria-label="Instagram">
                        <VisuallyHidden>Instagram</VisuallyHidden>
                        <Box as={FaInstagram} boxSize="22px" color="whiteAlpha.900" />
                      </Link>
                      <Link href="#" isExternal aria-label="Facebook">
                        <VisuallyHidden>Facebook</VisuallyHidden>
                        <Box as={FaFacebook} boxSize="22px" color="whiteAlpha.900" />
                      </Link>
                      <Link href="#" isExternal aria-label="GitHub">
                        <VisuallyHidden>GitHub</VisuallyHidden>
                        <Box as={FaGithub} boxSize="22px" color="whiteAlpha.900" />
                      </Link>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>

              {/* SVG overlay */}
              <chakra.svg
                viewBox="0 0 800 600"
                position="absolute"
                inset={0}
                w="full"
                h="full"
                opacity={0.6}
                
                style={{ mixBlendMode: 'soft-light' }}
                zIndex={0}
              >
                <defs>
                  <linearGradient id="g-accent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={BRAND.accent} stopOpacity="0.45" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  <filter id="blur40" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
                  </filter>
                </defs>

                <circle cx="140" cy="90" r="220" fill="url(#g-accent)" filter="url(#blur40)" />
                <circle cx="680" cy="180" r="180" fill="url(#g-accent)" filter="url(#blur40)" />
                <circle cx="480" cy="520" r="220" fill="url(#g-accent)" filter="url(#blur40)" />

                {[140, 220, 300, 380, 460].map((y, i) => (
                  <path
                    key={y}
                    d={`M0 ${y} Q 150 ${y - 20}, 300 ${y} T 600 ${y} T 900 ${y}`}
                    fill="none"
                    stroke={`rgba(255,255,255,${0.1 + i * 0.05})`}
                    strokeWidth="1"
                  />
                ))}
              </chakra.svg>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* WHITE CONTENT AREA BELOW */}
      <Box
        className="parallax__layer__6"
        
        mt={`${SCROLLING_POTENTIAL_PX}px`}
        position="relative"
      >
        <Box
          pb={`${SCROLLING_POTENTIAL_PX}px`}
          mb={`-${SCROLLING_POTENTIAL_PX}px`}
          position="relative"
        >
          <Box opacity={0}>
            <Image src="/content/synthwave/shinobu4.png" alt="" />
          </Box>

          <Box h="100%">
            <Box py="20" bg="white">
              {/* Counter im ChangeCoaching-Stil */}
              <AchivementCounter
                items={[
                  { label: 'Jahre', value: 5, suffix: '+' },
                  { label: 'Therapien', value: 500, suffix: '+' },
                  { label: 'Coachings', value: 900, suffix: '+' }
                ]}
                // optional: brand={{ base:'#18011a', accent:'#7f188c', white:'#ffffff' }}
              />

              <ChangeCoaching />

              <Psychotherapy accentColor="#7f188c" />
              <NonDisclosure accentColor="#7f188c" />
              <Prices accentColor="#7f188c" />
              <Associates />
              <BlogSlider blogIndex={blogIndex} />
              <FAQ />
              {/* <Container
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
              </Container> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


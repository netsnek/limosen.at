import {
  AspectRatio,
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Container,
  chakra,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { Field, useAuth } from 'jaen';
import useNavOffset from '../../hooks/use-nav-offset';
import { Link } from 'gatsby-plugin-jaen';

// import {useContactModal} from '../services/contact'
import Netsnek from '../../gatsby-plugin-jaen/components/Netsnek';
import useScrollPosition from '../../hooks/use-scroll-position';
import { FadeIn } from '../FadeIn';
import { useContactModal } from '../../services/contact';
import { UncontrolledMdxField } from 'jaen-fields-mdx';
import SvgMdxEditor from '../mdx-editor/SvgMdxEditor';

import MountainSVG from '../MountainSvg';
import { ParallaxHero } from '../ParallaxHero';

interface ScrollArrowsProps {
  isVisible: boolean;
}

const ScrollArrows: React.FC<ScrollArrowsProps> = ({ isVisible }) => {
  return (
    <Box
      alignSelf="flex-end"
      h="100px"
      opacity={isVisible ? '1' : '0'}
      transition={'opacity 0.5s ease-in-out'}
      position="relative"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Box
          key={index}
          position="absolute"
          left="50%"
          top={`${index * 16}px`}
          w="24px"
          h="24px"
          animation={`scrollarrows 2s infinite ${index * 0.15}s`} // Add animationDelay here
          opacity="0"
          borderRadius={'sm'}
          // borderLeft='2px solid'
          // borderBottom='2px solid'
          // borderColor='brand.500' // Use color from theme
          boxShadow="-2px 2px 2px rgba(0, 0, 0, 0.1)"
          transform="translateX(-50%) rotate(-45deg)"
        />
      ))}
    </Box>
  );
};

export function SynthwaveSVG() {
  return (
    <chakra.svg
      position="absolute"
      top={0}
      left={0}
      // Make the SVG fill its container width, with responsive height
      width="100%"
      height="auto"
      overflow="visible"
      // Define the coordinate system for the SVG
      viewBox="0 0 400 300"
      // Helps maintain aspect ratio when scaling
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject
        // Match the viewBox dimensions for a 1:1 scale of embedded content
        x="0"
        y="0"
        width="400"
        height="300"
      >
        {/*
          IMPORTANT: Use the XHTML namespace on your container 
          so that <img> and <video> render correctly inside <foreignObject>.
        */}
        <div xmlns="http://www.w3.org/1999/xhtml">
          <img
            src="/content/synthwave/flaser.png"
            alt="DarkMountainIMG"
            style={{ marginBottom: "-6px", display: "block" }}
          />
          <video
            autoPlay
            muted
            loop
            width="100%"
            height="auto"
            style={{ display: "block" }}
          >
            <source src="/content/synthwave/synthwave.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </foreignObject>
    </chakra.svg>
  );
}


const Hero: FC = () => {
  const navOffset = useNavOffset();

  const isAuthenticated = useAuth().user !== null;

  //const {ref, scrollTop} = useScrollSync(500)
  const scrollPos = useScrollPosition();

  const contactModal = useContactModal()

  const onContactClick = () => {
    contactModal.onOpen({
      meta: {}
    })
  };

  const ComponentFade = useBreakpointValue({ base: VStack, md: FadeIn });

  return (
<ParallaxHero noScroll={false} />

  );
  return (
    <Box as="header" h={"2000px"}>
      <ParallaxHero noScroll={false} />
      <AspectRatio ratio={16 / 9} h={'85vh'} w={'100%'}>
        <Box position="relative">
          {/* <Image position="absolute" bottom={-48} left={0} src="/content/synthwave/pink_mountain.png" alt="DarkMountainIMG" />
          <Image position="absolute" bottom={-48} left={0} src="/content/synthwave/purple_mountain.png" alt="DarkMountainIMG" />
          <Image position="absolute" bottom={-48} left={0} src="/content/synthwave/dark_mountain.png" alt="DarkMountainIMG" /> */}
          {/* <MountainSVG
            position="absolute"
            left={0}
            w={"100%"}
            seed={98765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            airGap={0}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#400542"
          />
          <MountainSVG
            position="absolute"
            w={"100%"}
            seed={765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            airGap={100}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#26072a"
          />
          <MountainSVG
            position="absolute"
            w={"100%"}
            seed={9765}
            startHeight={508}
            minMountainHeight={56}
            maxMountainHeight={512}
            maxOffsetHeight={64}
            airGap={200}
            width={1920}
            minOffsetWidth={32}
            maxOffsetWidth={96}
            baseColour="#1e0521"
          /> */}

          <SynthwaveSVG />

          <Image position="absolute" bottom={0} left={0} src="/content/synthwave/shinobu.png" alt="DarkMountainIMG" />
        </Box>
      </AspectRatio>
      <Grid
        as={Container}
        maxW="6xl"
        // h={{ base: 'max-content', md: `calc(100vh - ${navOffset} - 200px)` }}
        // minH="700px"
        position="relative"
        templateAreas={{
          base: `"image" "content" "customer"`,
          md: `"content image" "customer customer"`
        }}
        gridTemplateColumns={{ md: '1fr 1fr' }}
        gridTemplateRows={{ base: 'auto 1fr auto', md: '1fr auto' }}
        pt={{ base: 8, md: 16 }}
        pb={{ base: '16', lg: '0' }}
        px={{ base: 8, md: 16 }}
        id="hero"
        overflow="hidden"
      //p={{ base: 5, lg: 0 }}
      // pt={`calc(${navOffset})`}
      >
        <Box
          // as={FadeIn}
          position="relative"
          gridArea="image"
        >
          <AspectRatio ratio={1 / 1.04} w="full" h="auto" maxH="700px">
            <Box position="relative" w="full" h="full">
              <Box
                defaultValue="/images/header-portrait-image.png"
                name="heroimage"
                as={Field.Image}
                alt="hero image"
                objectFit="cover"
                w="full"
                h="full"
                ml={{ base: 8, md: 16 }}
                sx={{
                  //borderRadius: 'md',
                  //filter: 'drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))'
                }}
              />
              {/* <Image
                src="images/header-portrait-image.png"
                alt="hero image"
                objectFit="cover"
                w="full"
                h="full"
                sx={{
                  //borderRadius: 'md',
                  //filter: 'drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))'
                }}
              /> */}
            </Box>
          </AspectRatio>
        </Box>
        <VStack
          as={ComponentFade}
          pt={`calc(${navOffset})`}
          spacing={4}
          align="left"
          alignItems="flex-start"
          //justify="flex-start"
          gridArea="content"
          pr={{ base: 8, md: 16 }}
        >
          <Heading
            as="h3"
            variant="cursive"
            size={{ base: 'sm', lg: 'md' }}
            style={{ animationDelay: '300ms' }}
            fontWeight="500"
            //textTransform="uppercase"
            lineHeight="1.5em"
            letterSpacing="4.2px"
          >
            Gesund<chakra.span color="brand.500">·</chakra.span>Einfach
            <chakra.span color="brand.500">·</chakra.span>Ehrlich
          </Heading>
          <Field.Text
            as={Heading}
            fontSize={{ base: '2xl', lg: '4xl' }}
            lineHeight={1}
            fontWeight="900"
            textAlign="left"
            name="HeroTitle"
            defaultValue="Dein <u>Leben</u>. <br/> Deine <u>Ernährung</u>. <br/> Perfekt abgestimmt."
          />
          <Field.Text
            as={Text}
            fontSize={'lg'}
            opacity={0.5}
            textAlign="left"
            name="HeroLead"
            defaultValue="Werde dir bewusst, wie deine Ernährung Körper und Geist beeinflusst – und erlerne die Kunst, dein Wohlbefinden gezielt zu steuern."
          />
          <HStack spacing={4} mt={4}>
            <Button
              variant="solid"
              filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
              onClick={onContactClick}
            >
              Lernen wir uns kennen
            </Button>
            {/* <Button
              variant="outline"
              bg={'white'}
              filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
              onClick={() => (window.location.href = '/docs')}
              borderWidth={2}
            >
              Projekte ansehen
            </Button> */}
          </HStack>
        </VStack>
        <Box gridArea="customer">
          {/* <Text>Customer Testimonials or Data</Text> */}
          {/* <ScrollArrows isVisible={scrollPos < 100} /> */}
          {/* Any additional content for the customer area goes here */}
        </Box>
      </Grid>
    </Box>
  );
};

export default Hero;

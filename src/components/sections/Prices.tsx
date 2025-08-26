// Prices.tsx
import { FC } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  VStack,
  Tag,
  Button,
  Divider,
  chakra
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Gleiche Brandfarben wie in den anderen Sections
const BRAND = {
  base: '#18011a',
  accent: '#7f188c',
  white: '#ffffff'
};

// Tag-Glow wie in ChangeCoaching/Psychotherapie/NonDisclosure
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

export interface PricesProps {
  id?: string;
  accentColor?: string;
  headingFont?: string; // gleiche Überschrift-Font wie bei den anderen Sections
}

const Row: FC<{ label: string; price: string; duration: string }> = ({ label, price, duration }) => (
  <HStack justify="space-between" align="center" py={2}>
    <Text fontWeight="700">{label}</Text>
    <HStack spacing={3}>
      <Text fontWeight="900">{price}</Text>
      <Text color="blackAlpha.700" fontWeight="600">à {duration}</Text>
    </HStack>
  </HStack>
);

const Prices: FC<PricesProps> = ({
  id = 'preise',
  accentColor,
  headingFont = "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
}) => {
  const ACCENT = accentColor ?? BRAND.accent;

  return (
    <Box as="section" id={id} bg="white" color="black" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        {/* Intro / Titel */}
        <Tag
          size="lg"
          borderRadius="full"
          px={4}
          py={2}
          bg={`${ACCENT}1A`}
          color={ACCENT}
          fontWeight="800"
          letterSpacing="0.06em"
          textTransform="uppercase"
          border="1px solid"
          borderColor={`${ACCENT}66`}
          animation={`${glow} 2.2s ease-in-out infinite alternate`}
        >
          Preise
        </Tag>

        <Heading
          as="h2"
          mt={4}
          fontSize={{ base: '2xl', md: '3xl' }}
          lineHeight="1.2"
          fontWeight="900"
          fontFamily={headingFont}
        >
          Transparente Kosten – Coaching &amp; Psychotherapie
        </Heading>

        {/* Preis-Karten */}
        <SimpleGrid mt={{ base: 8, md: 12 }} columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 12 }}>
          {/* Coaching */}
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="blackAlpha.200"
            boxShadow="0 12px 40px rgba(0,0,0,0.12)"
            bg="white"
          >
            {/* dezentes Accent-Overlay oben rechts – wie die Bild-Boxen */}
            {/* <Box
              position="absolute"
              inset={0}
              bgGradient={`linear(to-tr, transparent 60%, ${ACCENT}33 100%)`}
              pointerEvents="none"
            /> */}
            <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
              <Heading as="h3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="900" mb={2}>
                Coaching
              </Heading>
              <Text color="blackAlpha.700" mb={4}>
                Einzel- und Gruppensettings – ziel- und ressourcenorientiert.
              </Text>

              <VStack align="stretch" spacing={0}>
                <Row label="Erstgespräch" price="0 €" duration="50 Minuten" />
                <Divider />
                <Row label="Einzelsetting" price="80 €" duration="50 Minuten" />
                <Divider />
                <Row label="Gruppen" price="40 €" duration="60 Minuten" />
              </VStack>
            </Box>
          </Box>

          {/* Psychotherapie */}
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="blackAlpha.200"
            boxShadow="0 12px 40px rgba(0,0,0,0.12)"
            bg="white"
          >
            {/* <Box
              position="absolute"
              inset={0}
              bgGradient={`linear(to-tr, transparent 60%, ${ACCENT}33 100%)`}
              pointerEvents="none"
            /> */}
            <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
              <Heading as="h3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="900" mb={2}>
                Psychotherapie
              </Heading>
              <Text color="blackAlpha.700" mb={4}>
                Tiefenpsychologisch fundiert – vertraulich und prozessorientiert.
              </Text>

              <VStack align="stretch" spacing={0}>
                <Row label="Erstgespräch" price="0 €" duration="50 Minuten" />
                <Divider />
                <Row label="Einzelsetting" price="160 €" duration="50 Minuten" />
                <Divider />
                <Row label="Gruppen" price="80 €" duration="60 Minuten" />
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>

        {/* Hinweistexte / Call to Action */}
        <VStack align="start" spacing={3} mt={{ base: 8, md: 12 }}>
          <Text color="blackAlpha.800" lineHeight="1.7">
            Das <chakra.span fontWeight="700">Erstgespräch</chakra.span> dient dem gegenseitigen Kennenlernen,
            dem Klären deines Anliegens und der Wahl des passenden Settings.
          </Text>
          <HStack pt={2}>
            <Button
              borderRadius="full"
              bg={ACCENT}
              color="white"
              _hover={{ filter: 'brightness(1.1)' }}
              as="a"
              href="?contact"
              fontWeight="900"
            >
              Erstgespräch vereinbaren
            </Button>
            <Button
              variant="outline"
              borderRadius="full"
              borderColor="blackAlpha.400"
              color="black"
              _hover={{ bg: 'blackAlpha.50' }}
              as="a"
              href="#faq"
              fontWeight="800"
            >
              Fragen &amp; Antworten
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Prices;

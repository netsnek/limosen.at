// Prices.tsx
import { FC, ReactNode } from 'react';
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
  chakra,
  Stack
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Field } from 'jaen';
// ✅ Contact modal hook
import { useContactModal } from '../../services/contact';

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

const Row: FC<{ label: ReactNode; price: ReactNode; duration: ReactNode }> = ({
  label,
  price,
  duration
}) => (
  <HStack justify="space-between" align="center" py={2}>
    <Text fontWeight="700">{label}</Text>
    <HStack spacing={3}>
      <Text fontWeight="900">{price}</Text>
      <Text color="blackAlpha.700" fontWeight="600">
        à {duration}
      </Text>
    </HStack>
  </HStack>
);

const Prices: FC<PricesProps> = ({
  id = 'preise',
  accentColor,
  headingFont = "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
}) => {
  const ACCENT = accentColor ?? BRAND.accent;

  // ✅ Hook + handler for the contact modal
  const contactModal = useContactModal();
  const handleOnContactClick = () => {
    contactModal.onOpen({ meta: {} });
  };

  return (
    <Box
      as="section"
      id={id}
      bg="white"
      color="black"
      py={{ base: 10, md: 16 }}
    >
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
          <Field.Text as={chakra.span} name="PricesTag" defaultValue="Preise" />
        </Tag>
        <Heading
          as="h2"
          mt={4}
          fontFamily={headingFont}
          fontSize={{ base: '2xl', md: '3xl' }}
          lineHeight="1.2"
          fontWeight="900"
        >
          <Field.Text
            as={chakra.span}
            name="PricesHeading"
            defaultValue="Transparente Kosten – Coaching &amp; Psychotherapie"
          />
          <chakra.span color={ACCENT}>.</chakra.span>
        </Heading>

        {/* Preis-Karten */}
        <SimpleGrid
          mt={{ base: 8, md: 12 }}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 8, md: 12 }}
        >
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
            <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
              <Heading
                as="h3"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="900"
                mb={2}
              >
                <Field.Text
                  as={chakra.span}
                  name="PricesCoachingTitle"
                  defaultValue="Coaching"
                />
              </Heading>
              <Text color="blackAlpha.700" mb={4}>
                <Field.Text
                  as={chakra.span}
                  name="PricesCoachingDesc"
                  defaultValue="Einzel- und Gruppensettings – ziel- und ressourcenorientiert."
                />
              </Text>

              <VStack align="stretch" spacing={0}>
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow1Label"
                      defaultValue="Erstgespräch"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow1Price"
                      defaultValue="0 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow1Duration"
                      defaultValue="50 Minuten"
                    />
                  }
                />
                <Divider />
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow2Label"
                      defaultValue="Einzelsetting"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow2Price"
                      defaultValue="80 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow2Duration"
                      defaultValue="50 Minuten"
                    />
                  }
                />
                <Divider />
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow3Label"
                      defaultValue="Gruppen"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow3Price"
                      defaultValue="40 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesCoachingRow3Duration"
                      defaultValue="60 Minuten"
                    />
                  }
                />
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
            <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
              <Heading
                as="h3"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="900"
                mb={2}
              >
                <Field.Text
                  as={chakra.span}
                  name="PricesTherapyTitle"
                  defaultValue="Psychotherapie"
                />
              </Heading>
              <Text color="blackAlpha.700" mb={4}>
                <Field.Text
                  as={chakra.span}
                  name="PricesTherapyDesc"
                  defaultValue="Tiefenpsychologisch fundiert – vertraulich und prozessorientiert."
                />
              </Text>

              <VStack align="stretch" spacing={0}>
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow1Label"
                      defaultValue="Erstgespräch"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow1Price"
                      defaultValue="0 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow1Duration"
                      defaultValue="50 Minuten"
                    />
                  }
                />
                <Divider />
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow2Label"
                      defaultValue="Einzelsetting"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow2Price"
                      defaultValue="160 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow2Duration"
                      defaultValue="50 Minuten"
                    />
                  }
                />
                <Divider />
                <Row
                  label={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow3Label"
                      defaultValue="Gruppen"
                    />
                  }
                  price={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow3Price"
                      defaultValue="80 €"
                    />
                  }
                  duration={
                    <Field.Text
                      as={chakra.span}
                      name="PricesTherapyRow3Duration"
                      defaultValue="60 Minuten"
                    />
                  }
                />
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>

        {/* Hinweistexte / Call to Action */}
        <VStack align="stretch" spacing={3} mt={{ base: 8, md: 12 }}>
          <Text color="blackAlpha.800" lineHeight="1.7">
            <Field.Text
              as={chakra.span}
              name="PricesNote"
              defaultValue="Das <b>Erstgespräch</b> dient dem gegenseitigen Kennenlernen, dem Klären deines Anliegens und der Wahl des passenden Settings."
            />
          </Text>

          {/* Buttons: stacked on mobile, inline from sm up; full width on base */}
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={3}
            pt={2}
            align={{ base: 'stretch', sm: 'center' }}
            w="full"
          >
            {/* ✅ Opens contact modal */}
            <Button
              borderRadius="full"
              bg={ACCENT}
              color="white"
              _hover={{ filter: 'brightness(1.1)' }}
              fontWeight="900"
              type="button"
              onClick={handleOnContactClick}
              w={{ base: 'full', sm: 'auto' }}
            >
              <Field.Text
                as={chakra.span}
                name="PricesCTA1"
                defaultValue="Erstgespräch vereinbaren"
              />
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
              w={{ base: 'full', sm: 'auto' }}
            >
              <Field.Text
                as={chakra.span}
                name="PricesCTA2"
                defaultValue="Fragen &amp; Antworten"
              />
            </Button>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Prices;

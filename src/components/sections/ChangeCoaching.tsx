// ChangeCoaching.tsx
import { FC } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Tag,
  List,
  ListItem,
  ListIcon,
  chakra
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Field } from 'jaen';

// ✅ Contact modal hook
import { useContactModal } from '../../services/contact';

// Optional: gleiche Brandfarben wie im Hero verwenden
const BRAND = {
  base: '#18011a',
  accent: '#7f188c',
  white: '#ffffff'
};

// Subtile Akzent-Animation für Linien/Tags
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

// Check-Icon (leicht & modern)
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';

export interface ChangeCoachingProps {
  id?: string;
  accentColor?: string; // überschreibt BRAND.accent bei Bedarf
}

const FeatureItem: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ListItem display="flex" alignItems="center" fontWeight="600">
    <ListIcon as={FiCheckCircle} color={`${BRAND.accent}`} boxSize="18px" />
    <chakra.span>{children}</chakra.span>
  </ListItem>
);

const ChangeCoaching: FC<ChangeCoachingProps> = ({
  id = 'change-coaching',
  accentColor
}) => {
  const ACCENT = accentColor ?? BRAND.accent;
  const headingFont =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

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
        {/* Intro-Zeile */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 8, md: 12 }}
          alignItems="center"
        >
          <Box order={{ base: 2, md: 1 }}>
            <Tag
              size="lg"
              borderRadius="full"
              px={4}
              py={2}
              bg={`${ACCENT}1A`} // 10% Opazität
              color={ACCENT}
              fontWeight="800"
              letterSpacing="0.06em"
              textTransform="uppercase"
              border="1px solid"
              borderColor={`${ACCENT}66`}
              animation={`${glow} 2.2s ease-in-out infinite alternate`}
            >
              <Field.Text
                as={chakra.span}
                name="ChangeCoachingTag"
                defaultValue="Change Coaching"
              />
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
                name="ChangeCoachingHeadline"
                defaultValue="Wandel meistern – nicht nur mithalten"
              />
              <chakra.span color={BRAND.accent}>.</chakra.span>
            </Heading>
            <Text
              mt={4}
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.7"
              color="blackAlpha.800"
            >
              <Field.Text
                as={chakra.span}
                name="ChangeIntro"
                defaultValue="Die Welt wird immer komplexer und Arbeit zunehmend abstrakt. Auch gesunde Menschen erleben heute enorme psychische Belastungen. Ich helfe dir, mit dem Leistungsdruck des 21. Jahrhunderts umzugehen – und begleite dich bei <b>Herausforderungen</b> und <b>Möglichkeiten</b>. In Kooperation mit technischen Consultants schaffen wir Klarheit rund um KI, Tools & Prozesse."
              />
            </Text>
            <VStack align="stretch" spacing={4} mt={6}>
              <Box>
                <Heading as="h3" fontSize="lg" fontWeight="800" mb={2}>
                  <Field.Text
                    as={chakra.span}
                    name="ChangeSpecialsHeading"
                    defaultValue="Meine Spezialitäten"
                  />
                </Heading>
                <List
                  spacing={2}
                  columnGap={8}
                  display="grid"
                  gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                >
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat1"
                      defaultValue="KI-Leistungsdruck"
                    />
                  </FeatureItem>
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat2"
                      defaultValue="Technophobie"
                    />
                  </FeatureItem>
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat3"
                      defaultValue="Tech-Life-Balance"
                    />
                  </FeatureItem>
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat4"
                      defaultValue="Social-Media-Sucht"
                    />
                  </FeatureItem>
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat5"
                      defaultValue="Impostor-Syndrom"
                    />
                  </FeatureItem>
                  <FeatureItem>
                    <Field.Text
                      as={chakra.span}
                      name="ChangeFeat6"
                      defaultValue="Digital Detox"
                    />
                  </FeatureItem>
                </List>
              </Box>
              <HStack spacing={3} pt={1}>
                {/* ✅ Opens contact modal instead of navigating */}
                <Button
                  borderRadius="full"
                  bg={ACCENT}
                  color="white"
                  _hover={{ filter: 'brightness(1.1)' }}
                  fontWeight="900"
                  type="button"
                  onClick={handleOnContactClick}
                >
                  <Field.Text
                    as={chakra.span}
                    name="ChangeCTA1Label"
                    defaultValue="Kostenloses Erstgespräch"
                  />
                </Button>
                <Button
                  variant="outline"
                  borderRadius="full"
                  borderColor="blackAlpha.400"
                  color="black"
                  _hover={{ bg: 'blackAlpha.50' }}
                  as="a"
                  href="/docs"
                  fontWeight="800"
                >
                  <Field.Text
                    as={chakra.span}
                    name="ChangeCTA2Label"
                    defaultValue="Mehr erfahren"
                  />
                </Button>
              </HStack>
            </VStack>
          </Box>
          {/* Bild – frei austauschbar; jetzt als Jaen Field.Image */}
          <Box
            order={{ base: 1, md: 2 }}
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="blackAlpha.200"
            boxShadow="0 12px 40px rgba(0,0,0,0.12)"
            minH={{ base: '260px', md: '420px' }}
          >
            {/* Fill container with editable image */}
            <Box position="absolute" inset={0}>
              <Field.Image
                name="ChangeCoachingImage"
                defaultValue="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop"
                alt="Change Coaching – Klarheit im Wandel"
                objectFit="cover"
              />
            </Box>
            <Box
              position="absolute"
              inset={0}
              bgGradient={`linear(to-tr, transparent 60%, ${ACCENT}33 100%)`}
              pointerEvents="none"
            />
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ChangeCoaching;

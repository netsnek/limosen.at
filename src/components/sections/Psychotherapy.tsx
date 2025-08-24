// Psychotherapie.tsx
import { FC } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Image,
  HStack,
  VStack,
  Button,
  Tag,
  List,
  ListItem,
  ListIcon,
  chakra,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';

// Brandfarben
const BRAND = {
  base: '#18011a',
  accent: '#7f188c',
  white: '#ffffff',
};

// Subtile Akzent-Animation (wie in anderen Sections)
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

export interface PsychotherapieProps {
  id?: string;
  accentColor?: string; // überschreibt BRAND.accent
}

const Bullet: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ListItem display="flex" alignItems="flex-start" lineHeight="1.6">
    <ListIcon as={FiCheckCircle} color={BRAND.accent} boxSize="18px" mt="1" />
    <chakra.span>{children}</chakra.span>
  </ListItem>
);

const Psychotherapie: FC<PsychotherapieProps> = ({
  id = 'psychotherapie',
  accentColor,
}) => {
  const ACCENT = accentColor ?? BRAND.accent;

  return (
    <Box as="section" id={id} bg="white" color="black" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        {/* 2-Spalten-Layout mit klarer Links-Rechts-Hierarchie */}
        <SimpleGrid
          columns={{ base: 1, md: 12 }}
          spacing={{ base: 8, md: 12 }}
          alignItems="stretch"
        >
          {/* Bild links – bewusst etwas breiter, damit es nicht „dumm“/zu schmal wirkt */}
          <Box
            gridColumn={{ base: '1 / -1', md: '1 / span 5' }}
            order={{ base: 1, md: 1 }}
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="blackAlpha.200"
            boxShadow="0 12px 40px rgba(0,0,0,0.12)"
            // sorgt für eine solide Präsenz neben viel Text
            minH={{ base: '260px', md: '460px' }}
          >
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop"
              alt="Psychotherapie – ein verlässlicher, geschützter Rahmen"
              objectFit="cover"
              w="100%"
              h="100%"
            />
            <Box
              position="absolute"
              inset={0}
              // Leichte Glas/Accent-Schicht – von links oben, weil Bild links steht
              bgGradient={`linear(to-tl, transparent 60%, ${ACCENT}33 100%)`}
              pointerEvents="none"
            />
          </Box>

          {/* Text rechts */}
          <Box
            gridColumn={{ base: '1 / -1', md: '6 / span 7' }}
            order={{ base: 2, md: 2 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Tag
              size="lg"
              borderRadius="full"
              px={4}
              py={2}
              bg={`${ACCENT}1A`} // ~10% Opazität
              color={ACCENT}
              fontWeight="800"
              letterSpacing="0.06em"
              textTransform="uppercase"
              border="1px solid"
              borderColor={`${ACCENT}66`}
              animation={`${glow} 2.2s ease-in-out infinite alternate`}
              alignSelf={{ base: 'flex-start', md: 'flex-start' }}
            >
              Psychotherapie
            </Tag>

            <Heading
              as="h2"
              mt={4}
              fontSize={{ base: '2xl', md: '3xl' }}
              lineHeight="1.2"
              fontWeight="900"
            >
              Tiefenpsychologisch fundierte Psychotherapie
            </Heading>

            <Text mt={4} fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" color="blackAlpha.800" maxW="68ch">
              Tiefenpsychologisch fundierte Psychotherapie unterstützt dich dabei,
              <chakra.span fontWeight="700"> unbewusste Dynamiken zu verstehen</chakra.span> und
              deinen Handlungsspielraum zu erweitern. In einem geschützten, verlässlichen Rahmen
              arbeiten wir an den Mustern, die deinen Alltag, Beziehungen und deine
              Lebensgestaltung prägen – mit dem Ziel von mehr Selbstbestimmtheit und innerer Klarheit.
            </Text>

            {/* Therapieformen */}
            <VStack align="stretch" spacing={5} mt={8}>
              <Box id="therapieformen">
                <Heading as="h3" fontSize="lg" fontWeight="900" mb={2}>
                  Therapieformen
                </Heading>
                <List spacing={3}>
                  <Bullet>
                    <chakra.span fontWeight="800">Psychoanalyse:</chakra.span>{' '}
                    Unbewusstes wird verstehbar – mittels freier Assoziation und gemeinsamer Arbeit
                    an Abwehrmechanismen. Sitzend oder auf der Couch, in der Regel <em>mehrmals wöchentlich</em>.
                  </Bullet>
                  <Bullet>
                    <chakra.span fontWeight="800">Psychoanalytisch orientierte Psychotherapie:</chakra.span>{' '}
                    Sitzend, <em>ein–zweimal pro Woche</em>. Mentalisierungsbasiert mit Fokus auf dein Beziehungsmuster:
                    wir verstehen, wie Auslöser (Trigger) zu wiederkehrenden Konflikten in Beruf, Alltag und
                    Partnerschaft führen – und verändern das.
                  </Bullet>
                  <Bullet>
                    <chakra.span fontWeight="800">Fokale Kurzzeittherapie:</chakra.span>{' '}
                    Ziel- und lösungsorientiert für klar umrissene Anliegen. Wir arbeiten fokussiert
                    und zeitlich begrenzt – damit ein konkretes Problem bestmöglich gelöst werden kann.
                  </Bullet>
                  <Bullet>
                    <chakra.span fontWeight="800">Krisenbewältigung:</chakra.span>{' '}
                    Akute Belastungen ordnen, Einflussfaktoren benennen, Klarheit gewinnen – und
                    tragfähige Schritte entwickeln, um die aktuelle Situation zu bewältigen.
                  </Bullet>
                </List>
              </Box>

              {/* Beispiele – Ich behandle */}
              <Box>
                <Heading as="h3" fontSize="lg" fontWeight="900" mb={2}>
                  Ich behandle – Beispiele
                </Heading>
                <List
                  spacing={2}
                  columnGap={8}
                  display="grid"
                  gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                >
                  <Bullet>Angststörungen &amp; Zwangsstörungen</Bullet>
                  <Bullet>Depressionen &amp; Trauerbegleitung</Bullet>
                  <Bullet>Psychosomatische Beschwerden</Bullet>
                  <Bullet>Prokrastination &amp; Verhaltenssüchte</Bullet>
                  <Bullet>Autismus-Spektrum-Störung (ASS)</Bullet>
                  <Bullet>Anpassungsstörungen nach Verlusten / Veränderungen</Bullet>
                  <Bullet>Beziehungsprobleme &amp; Persönlichkeitsentwicklung</Bullet>
                </List>
              </Box>

              <HStack spacing={3} pt={2}>
                <Button
                  borderRadius="full"
                  bg={ACCENT}
                  color="white"
                  _hover={{ filter: 'brightness(1.1)' }}
                  as="a"
                  href="#kontakt"
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
                  href="#therapieformen"
                  fontWeight="800"
                >
                  Mehr zu den Formen
                </Button>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Psychotherapie;

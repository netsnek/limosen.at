// NonDisclosure.tsx
import { FC } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  Button,
  Tag,
  chakra,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Field } from 'jaen';
// Kein Schild-Icon
import { FiCheckCircle as FiCheck } from '@react-icons/all-files/fi/FiCheckCircle';
// ✅ Contact modal hook
import { useContactModal } from '../../services/contact';

const BRAND = {
  base: '#18011a',
  accent: '#7f188c',
  white: '#ffffff'
};

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

export interface NonDisclosureProps {
  id?: string;
  accentColor?: string;
  headingFont?: string;
}

const NonDisclosure: FC<NonDisclosureProps> = ({
  id = 'non-disclosure',
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
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 8, md: 12 }}
          alignItems="center"
        >
          {/* Text */}
          <Box order={{ base: 2, md: 1 }}>
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
              <Field.Text
                as={chakra.span}
                name="NDTag"
                defaultValue="Schweigepflicht"
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
                name="NDHeading"
                defaultValue="Vertraulichkeit &amp; Schutz deiner Privatsphäre"
              />
              <chakra.span color={ACCENT}>.</chakra.span>
            </Heading>
            {/* Intro mit editierbaren starken Fragmenten */}
            <Text
              mt={4}
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.7"
              color="blackAlpha.800"
            >
              <Field.Text
                as={chakra.span}
                name="NDIntroStart"
                defaultValue="Die Schweigepflicht gilt bei mir <b>vom ersten bis zum letzten gewechselten Wort</b> – unabhängig davon, ob wir persönlich, telefonisch oder schriftlich kommunizieren. Ich lebe sie sowohl in der Psychotherapie als auch im Coaching. <b>Weil Vertrauen ist die Grundlage für jede gute Zusammenarbeit.</b>"
              />
            </Text>
            <List mt={6} spacing={2}>
              <ListItem display="flex" alignItems="flex-start" lineHeight="1.6">
                <ListIcon as={FiCheck} color={ACCENT} boxSize="18px" mt="1" />
                <Field.Text
                  as={chakra.span}
                  name="NDList1"
                  defaultValue="Keine Weitergabe von Inhalten an Dritte – ohne deine ausdrückliche, vorherige Zustimmung."
                />
              </ListItem>
              <ListItem display="flex" alignItems="flex-start" lineHeight="1.6">
                <ListIcon as={FiCheck} color={ACCENT} boxSize="18px" mt="1" />
                <Field.Text
                  as={chakra.span}
                  name="NDList2a"
                  defaultValue="Gleiche Standards für Psychotherapie <b>und</b> Coaching."
                />
              </ListItem>
            </List>
            <HStack spacing={3} pt={6}>
              {/* ✅ Opens contact modal */}
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
                  name="NDCTA1"
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
                href="#rahmenbedingungen"
                fontWeight="800"
              >
                <Field.Text
                  as={chakra.span}
                  name="NDCTA2"
                  defaultValue="Mehr erfahren"
                />
              </Button>
            </HStack>
          </Box>
          {/* Bild */}
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
                name="NDImage"
                defaultValue="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop"
                alt="Vertraulichkeit – ein sicherer Rahmen"
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

export default NonDisclosure;

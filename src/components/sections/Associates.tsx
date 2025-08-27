// Associates.tsx
import { FC } from 'react';
import {
  Box,
  Container,
  Heading,
  Tag,
  Text,
  Image,
  LinkBox,
  LinkOverlay,
  useBreakpointValue,
  chakra,
  VisuallyHidden,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import Marquee from 'react-fast-marquee';
import { Field } from 'jaen';

const BRAND = { accent: '#7f188c' };

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

// Associates (Partner:innen)
interface Associate {
  href: string;
  name: string;
  logo: string;
}

const associates: Associate[] = [
  { href: 'https://pra.st/', name: 'Simon Prast', logo: '/images/associates/simon_prast.jpg' },
  { href: 'https://fhkit.at/', name: 'Florian Herbert Kleber IT', logo: '/images/associates/fhkit.svg' },
  { href: 'https://netsnek.com/', name: 'Netsnek e. U.', logo: '/images/associates/netsnek_logo.svg' },
  // { href: 'https://neurons.at/', name: 'Neurons', logo: '/images/associates/neurons.svg' },
];

const Associates: FC = () => {
  const itemSize = useBreakpointValue({ base: '200px', md: '230px' });
  const marqueeSpeed = useBreakpointValue({ base: 40, md: 60 });

  const headingFont =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

  return (
    <Box as="section" bg="white" color="black" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        {/* Tag + Headline im gleichen Stil, konsequent "ich" */}
        <Tag
          size="lg"
          borderRadius="full"
          px={4}
          py={2}
          bg={`${BRAND.accent}1A`}
          color={BRAND.accent}
          fontWeight="800"
          letterSpacing="0.06em"
          textTransform="uppercase"
          border="1px solid"
          borderColor={`${BRAND.accent}66`}
          animation={`${glow} 2.2s ease-in-out infinite alternate`}
        >
          <Field.Text
            as={chakra.span}
            name="AssociatesTag"
            defaultValue="Netzwerk für Change Coaching"
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
            name="AssociatesHeading"
            defaultValue="Ich kooperiere mit Expert:innen in Österreich"
          />
          <chakra.span color={BRAND.accent}>.</chakra.span>
        </Heading>
        <Text mt={3} color="blackAlpha.800">
          <Field.Text
            as={chakra.span}
            name="AssociatesDesc"
            defaultValue="Für mein <b>Change Coaching</b> binde ich – je nach Thema – passende Fachkompetenz ein (z.&nbsp;B. technische Consultants, IT/KI-Automatisierung, Design &amp; Content). So bekommst du genau die Unterstützung, die dein Wandel braucht."
          />
        </Text>
        {/* Logos als Marquee – ohne Overlay, clean & konsistent */}
        <Box mt={{ base: 8, md: 12 }}>
          <Marquee gradient={false} pauseOnHover speed={marqueeSpeed ?? 50}>
            <Box display="flex" columnGap={{ base: 6, md: 8 }}>
              {associates.map((a, i) => (
                <LinkBox
                  key={`${a.name}-${i}`}
                  aria-label={a.name}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={itemSize}
                  height={itemSize}
                  bg="white"
                  border="1px solid"
                  borderColor="blackAlpha.200"
                  borderRadius="2xl"
                  boxShadow="0 12px 40px rgba(0,0,0,0.12)"
                  px={4}
                  py={4}
                  mx={{ base: 2, md: 4 }}
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 18px 56px rgba(0,0,0,0.16)',
                  }}
                >
                  {/* Keep external link from the static list; label editable for a11y */}
                  <LinkOverlay href={a.href} isExternal>
                    <VisuallyHidden>
                      <Field.Text
                        as={chakra.span}
                        name={`Associate_${i}_LinkLabel`}
                        defaultValue={a.name}
                      />
                    </VisuallyHidden>
                  </LinkOverlay>

                  {/* Editable logo image */}
                  <Image
                    as={Field.Image as any}
                    name={`Associate_${i}_Logo`}
                    defaultValue={a.logo}
                    alt={a.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </LinkBox>
              ))}
            </Box>
          </Marquee>
        </Box>

        {/* CMS-editierbarer Footer-Text (optional) */}
        {/* <Box mt={{ base: 8, md: 12 }} textAlign="center">
          <Field.Text
            name="FooterLinkAllCustomers"
            defaultValue="Expert:innen aus meinem Netzwerk"
            fontSize="xl"
          />
        </Box> */}
      </Container>
    </Box>
  );
};

export default Associates;

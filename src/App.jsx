import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const CONTACT_EMAIL = 'office@limosen.at';
const CONTACT_PHONE = '+43 660 876 06 06';

const NAV_LINKS = [
  { label: 'Hauptseite', href: 'https://limosen.at/de' },
  { label: 'Unsere Fahrzeuge', href: 'https://limosen.at/de/cars' },
  { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
  { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
  { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/exclusiveaustriantransfer', icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/exclusive_austrian_transfer', icon: FaInstagram },
  { label: 'Twitter', href: 'https://www.twitter.com/exclusive_a_t', icon: FaTwitter },
];

const HERO_BACKGROUNDS = [
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244001207.jpeg',
  'https://admin.limosen.at/uploads/beauty_of_vienna-wallpaper-1920x10802-1593739458218.jpg',
];

const LOGO_SRC = 'https://admin.limosen.at/uploads/7-1601985268947.png';
const FLAG_SRC = 'https://limosen.at/flags/de.png';
const ABOUT_IMAGE = 'https://limosen.at/_nuxt/img/cars.3ec3e98.jpg';

export default function App() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showCookies, setShowCookies] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box color="whiteAlpha.900" minH="100vh" display="flex" flexDirection="column">
      <HeaderBar />
      <Navigation />
      <Box as="main" flex="1" display="flex" flexDirection="column" gap={0}>
        <HeroSection background={HERO_BACKGROUNDS[backgroundIndex]} />
        <AboutSection />
        <OnlineBookingSection />
      </Box>
      <Footer />
      {showCookies && <CookieNotice onAccept={() => setShowCookies(false)} />}
    </Box>
  );
}

function HeaderBar() {
  return (
    <Box bg="#1b1b1b" py={2} fontSize="sm">
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} gap={3}>
          <HStack spacing={3} align="center">
            <Link href={`mailto:${CONTACT_EMAIL}`} color="yellow.300">
              {CONTACT_EMAIL}
            </Link>
            <Link href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`} color="yellow.300">
              {CONTACT_PHONE}
            </Link>
          </HStack>
          <HStack spacing={3} ml={{ base: 0, md: 'auto' }}>
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <IconButton
                key={label}
                as={Link}
                href={href}
                aria-label={label}
                icon={<Icon />}
                isRound
                size="sm"
                colorScheme="whiteAlpha"
                variant="ghost"
              />
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function Navigation() {
  return (
    <Box bg="#252525" borderBottom="1px solid rgba(255, 255, 255, 0.08)">
      <Container maxW="6xl" py={6}>
        <VStack spacing={6} w="full">
          <Image src={LOGO_SRC} alt="Limosen KG" height={{ base: 20, md: 24 }} objectFit="contain" />
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            w="full"
            gap={6}
          >
            <Flex wrap="wrap" gap={4}>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} color="whiteAlpha.900" fontWeight="medium">
                  {link.label}
                </Link>
              ))}
            </Flex>
            <HStack spacing={3} align="center">
              <Image src={FLAG_SRC} alt="Deutsch" boxSize={6} />
              <Text fontWeight="semibold">DE</Text>
              <Button as={Link} href="https://limosen.at/de/booking" colorScheme="yellow" size="sm">
                Jetzt Buchen
              </Button>
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

function HeroSection({ background }) {
  return (
    <Box
      as="section"
      bgImage={`url('${background}')`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      minH={{ base: '320px', md: '520px' }}
    />
  );
}

function AboutSection() {
  return (
    <Box as="section" bg="#2f2f2f" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 8, md: 12 }} align="stretch">
          <VStack align="flex-start" spacing={6} flex="1">
            <Heading size="lg">Über uns</Heading>
            <Stack spacing={4} fontSize="lg">
              <Text>
                LIMOSEN KG verfolgt seit 2016 die sektoralen und technologischen Entwicklungen und ist das ganze Jahr rund um die
                Uhr erreichbar.
              </Text>
              <Text>
                Unsere Flotte bestehend aus den modernsten Mercedes-Benz-Fahrzeugen mit unseren freundlichen, professionellen und
                erfahrenen Fahrern und einer zuverlässigen, wirtschaftlichen und komfortablen Serviceauffassung steigern wir die
                Servicequalität permanent und wachsen kontinuierlich weiter.
              </Text>
              <Text>
                Kundenzufriedenheit ist unsere oberste Priorität und unser Unternehmen übt die Destinationen in unserem Portfolio
                in bester Weise aus, um unseren Kunden die höchste Qualität zu bieten.
              </Text>
            </Stack>
          </VStack>
          <Box
            flex={{ base: 'none', md: '0 0 40%' }}
            minH={{ base: '240px', md: '320px' }}
            borderRadius="lg"
            bgImage={`url('${ABOUT_IMAGE}')`}
            bgSize="cover"
            bgPos="center"
            bgRepeat="no-repeat"
          />
        </Flex>
      </Container>
    </Box>
  );
}

function OnlineBookingSection() {
  return (
    <Box as="section" bg="#1f1f1f" py={{ base: 12, md: 16 }}>
      <Container maxW="4xl">
        <VStack spacing={5} textAlign="center">
          <Heading size="md">
            Buchen sie heute und lassen Sie uns den Komfort Ihrer Reise berücksichtigen.
          </Heading>
          <Stack spacing={3} fontSize="lg">
            <Text>Sie können uns telefonisch</Text>
            <HStack justify="center" spacing={2}>
              <Text color="teal.200">☎</Text>
              <Link href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`} color="white">
                {CONTACT_PHONE}
              </Link>
            </HStack>
            <Text>und</Text>
            <Text>auch mit einer E-Mail erreichen</Text>
            <Link href={`mailto:${CONTACT_EMAIL}`} color="white">
              {CONTACT_EMAIL}
            </Link>
          </Stack>
          <Button as={Link} href="https://limosen.at/de/page/contact" colorScheme="yellow" variant="outline">
            Kontakt
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box as="footer" bg="#121212" py={6} textAlign="center" fontSize="sm">
      © All Rights Reserved LIMOSEN KG
    </Box>
  );
}

function CookieNotice({ onAccept }) {
  return (
    <Box
      bg="#2b2b2b"
      py={4}
      px={{ base: 4, md: 8 }}
      position="sticky"
      bottom={0}
      w="full"
      boxShadow="md"
      zIndex={10}
    >
      <Container maxW="4xl">
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center" justify="space-between">
          <Text textAlign={{ base: 'center', md: 'left' }}>
            Diese Seite verwendet Cookies. Mit der Weiternutzung der Seite, stimmst du die Verwendung von Cookies zu.
          </Text>
          <HStack spacing={4}>
            <Text fontWeight="medium">Datenschutzerklärung</Text>
            <Button colorScheme="yellow" onClick={onAccept} size="sm">
              Akzeptieren
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

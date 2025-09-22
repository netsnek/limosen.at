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
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const NAV_LINKS = [
  { label: 'Hauptseite', href: 'https://limosen.at/de' },
  { label: 'Unsere Fahrzeuge', href: 'https://limosen.at/de/cars' },
  { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
  { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
  { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
];

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/exclusiveaustriantransfer', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://www.instagram.com/exclusive_austrian_transfer', label: 'Instagram', icon: FaInstagram },
  { href: 'https://www.twitter.com/exclusive_a_t', label: 'Twitter', icon: FaTwitter },
];

const HERO_IMAGES = [
  "https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244001207.jpeg",
  'https://admin.limosen.at/uploads/beauty_of_vienna-wallpaper-1920x10802-1593739458218.jpg',
];

export default function App() {
  const [acceptedCookies, setAcceptedCookies] = useState(false);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <TopBar />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <OnlineBookingSection />
      <Footer />

      {!acceptedCookies && (
        <Box as="section" bg="gray.900" color="white" py={6} px={{ base: 4, md: 10 }} mt="auto">
          <Container maxW="6xl">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align={{ base: 'stretch', md: 'center' }}>
              <Text flex="1">
                Diese Seite verwendet Cookies. Mit der Weiternutzung der Seite, stimmst du die Verwendung von Cookies zu.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                <Button as={Link} href="https://limosen.at/de/page/privacy" variant="outline" colorScheme="whiteAlpha">
                  Datenschutzerklärung
                </Button>
                <Button colorScheme="yellow" onClick={() => setAcceptedCookies(true)}>
                  Akzeptieren
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
}

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box as="section" position="relative">
      <Box
        bgImage={`url('${HERO_IMAGES[activeSlide]}')`}
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
        minH={{ base: '360px', md: '520px' }}
        transition="background-image 0.8s ease-in-out"
      >
        <Box bg="blackAlpha.500" w="full" h="full">
          <Container maxW="6xl" minH={{ base: '360px', md: '520px' }} display="flex" alignItems="center">
            <VStack spacing={5} align="flex-start" color="white" maxW="2xl">
              <Heading size="2xl">Exclusive Austrian Transfer</Heading>
              <Text fontSize="lg">
                Ihr zuverlässiger Partner für exklusive Fahrten mit Mercedes-Benz Business- und First-Class-Fahrzeugen.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button as={Link} href="https://limosen.at/de/booking" colorScheme="yellow" size="lg">
                  Jetzt Buchen
                </Button>
                <Button as={Link} href="https://limosen.at/de/page/contact" variant="outline" colorScheme="whiteAlpha" size="lg">
                  Kontakt
                </Button>
              </Stack>
            </VStack>
          </Container>
        </Box>
      </Box>

      <HStack
        position="absolute"
        bottom={6}
        left="50%"
        transform="translateX(-50%)"
        spacing={2}
      >
        {HERO_IMAGES.map((_, index) => (
          <Box
            key={index}
            w={index === activeSlide ? 8 : 6}
            h={index === activeSlide ? 2 : 1}
            borderRadius="full"
            bg={index === activeSlide ? 'yellow.300' : 'whiteAlpha.700'}
            transition="all 0.3s ease"
          />
        ))}
      </HStack>
    </Box>
  );
}

function AboutSection() {
  return (
    <Box as="section" flex="1" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 10, lg: 12 }} alignItems="stretch">
          <VStack
            align="flex-start"
            spacing={6}
            bg="#1c1c1c"
            color="white"
            borderRadius="xl"
            p={{ base: 6, md: 10 }}
            boxShadow="xl"
          >
            <Heading size="2xl">Über uns</Heading>
            <Text fontSize="lg">
              LIMOSEN KG verfolgt seit 2016 die sektoralen und technologischen Entwicklungen und ist das ganze Jahr rund um die Uhr
              erreichbar. Unsere Flotte bestehend aus den modernsten Mercedes-Benz-Fahrzeugen mit unseren freundlichen,
              professionellen und erfahrenen Fahrern und einer zuverlässigen, wirtschaftlichen und komfortablen Serviceauffassung
              steigern wir die Servicequalität permanent und wachsen kontinuierlich weiter.
            </Text>
            <Text fontSize="lg">
              Kundenzufriedenheit ist unsere oberste Priorität und unser Unternehmen übt die Destinationen in unserem Portfolio in
              bester Weise aus, um unseren Kunden die höchste Qualität zu bieten. Buchen sie heute und lassen Sie uns den Komfort
              Ihrer Reise berücksichtigen.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} align={{ base: 'stretch', sm: 'center' }}>
              <Button as={Link} href="https://limosen.at/de/booking" colorScheme="yellow" size="lg" px={10}>
                Jetzt Buchen
              </Button>
              <Button as={Link} href="https://limosen.at/de/page/contact" variant="outline" colorScheme="yellow" size="lg" px={10}>
                Kontakt
              </Button>
            </Stack>
          </VStack>

          <AboutImage />
          <ContactDetails />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function TopBar() {
  return (
    <Box bg="gray.900" color="gray.100" py={2} fontSize="sm">
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} gap={{ base: 2, md: 6 }}>
          <HStack spacing={2}>
            <Link href="mailto:office@limosen.at" color="yellow.300">
              office@limosen.at
            </Link>
          </HStack>
          <HStack spacing={2}>
            <Link href="https://api.whatsapp.com/send?phone=+43 660 876 06 06" color="yellow.300">
              +43 660 876 06 06
            </Link>
          </HStack>
          <Flex align="center" gap={2} ml={{ base: 0, md: 'auto' }}>
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <IconButton
                key={label}
                as={Link}
                href={href}
                aria-label={label}
                icon={<Icon />}
                variant="ghost"
                colorScheme="yellow"
                size="sm"
                isExternal
              />
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

function Navigation() {
  return (
    <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="6xl">
        <Flex align="center" py={4} gap={6} wrap="wrap">
          <Flex align="center" gap={3} flexShrink={0}>
            <Image
              src="https://admin.limosen.at/uploads/7-1601985268947.png"
              alt="Limosen KG"
              boxSize={{ base: '48px', md: '60px' }}
              objectFit="contain"
            />
            <Text fontWeight="bold" fontSize={{ base: 'xl', md: '2xl' }} color="gray.800">
              Limosen KG
            </Text>
          </Flex>

          <Flex align="center" gap={{ base: 4, md: 8 }} wrap="wrap" flex="1" justify={{ base: 'flex-start', md: 'center' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} fontWeight="medium" color="gray.700" _hover={{ color: 'yellow.600' }}>
                {label}
              </Link>
            ))}
          </Flex>

          <Stack direction="row" align="center" spacing={3} flexShrink={0}>
            <HStack spacing={1}>
              <Image src="https://limosen.at/flags/de.png" alt="Deutsch" boxSize="24px" objectFit="cover" borderRadius="full" />
              <Text fontWeight="medium" color="gray.700">
                DE
              </Text>
            </HStack>
            <Button as={Link} href="https://limosen.at/de/booking" colorScheme="yellow" size="md">
              Jetzt Buchen
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}

function ContactDetails() {
  return (
    <Box bg="white" borderRadius="xl" boxShadow="lg" p={{ base: 6, md: 10 }} w="full">
      <Stack spacing={6}>
        <Heading size="lg" color="gray.800">
          Kontakt
        </Heading>
        <Text color="gray.700" fontSize="md">
          Sie können uns telefonisch und auch mit einer E-Mail erreichen.
        </Text>
        <SimpleGrid columns={1} spacing={4}>
          <InfoCard
            label="Telefon"
            value="+43 660 876 06 06"
            href="https://api.whatsapp.com/send?phone=+43 660 876 06 06"
          />
          <InfoCard label="E-Mail" value="office@limosen.at" href="mailto:office@limosen.at" />
        </SimpleGrid>
        <Button as={Link} href="https://limosen.at/de/page/contact" colorScheme="yellow" size="lg">
          Kontakt aufnehmen
        </Button>
      </Stack>
    </Box>
  );
}

function AboutImage() {
  return (
    <Box
      borderRadius="xl"
      boxShadow="lg"
      minH={{ base: '240px', md: '100%' }}
      bgImage="url('https://limosen.at/_nuxt/img/cars.3ec3e98.jpg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    />
  );
}

function OnlineBookingSection() {
  return (
    <Box
      as="section"
      bgImage="url('https://limosen.at/_nuxt/img/home-2.32cb6f9.jpg')"
      bgSize="cover"
      bgPos="top"
      bgRepeat="no-repeat"
      py={{ base: 12, md: 20 }}
      mt={-6}
    >
      <Box bg="blackAlpha.600">
        <Container maxW="6xl">
          <VStack spacing={6} color="white" textAlign="center">
            <Heading size="lg">Buchen sie heute und lassen Sie uns den Komfort Ihrer Reise berücksichtigen.</Heading>
            <Text fontSize="md">
              Sie können uns telefonisch <Link href="https://api.whatsapp.com/send?phone=+43 660 876 06 06" color="yellow.200">+43 660 876 06 06</Link> und auch mit einer E-Mail unter{' '}
              <Link href="mailto:office@limosen.at" color="yellow.200">office@limosen.at</Link> erreichen.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} justify="center">
              <Button as={Link} href="https://limosen.at/de/booking" colorScheme="yellow" size="lg">
                Jetzt Buchen
              </Button>
              <Button as={Link} href="https://limosen.at/de/page/contact" variant="outline" colorScheme="yellow" size="lg">
                Kontakt
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

function InfoCard({ label, value, href }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Text fontSize="sm" color="gray.500" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Link href={href} fontSize="lg" fontWeight="semibold" color="gray.800">
        {value}
      </Link>
    </Box>
  );
}

function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="gray.100" py={6} mt="auto">
      <Container maxW="6xl">
        <Text textAlign="center">© All Rights Reserved LIMOSEN KG</Text>
      </Container>
    </Box>
  );
}

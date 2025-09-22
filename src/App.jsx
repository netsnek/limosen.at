import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  FaEnvelopeOpen,
  FaEnvelopeOpenText,
  FaBars,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaSuitcaseRolling,
  FaTwitter,
  FaUser,
  FaWhatsapp,
} from 'react-icons/fa';

const CONTACT_EMAIL = 'office@limosen.at';
const CONTACT_PHONE = '+43 660 876 06 06';
const CONTACT_PHONE_TEL = '+436608760606';

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

const HERO_SLIDES = [
  'https://admin.limosen.at/uploads/beauty_of_vienna-wallpaper-1920x10802-1593739458218.jpg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589243923726.jpeg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244001207.jpeg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244017831.jpeg',
  'https://admin.limosen.at/uploads/vienna_austria_cityscape_4k-hd_wallpapers2-1593739468623.jpg',
  'https://admin.limosen.at/uploads/WhatsApp%20Image%202020-05-12%20at%2002-1589244160841.jpeg',
  'https://admin.limosen.at/uploads/wien-hofburg-palace-at-night_2880x18002-1593740896794.jpg',
];

const LOGO_SRC = 'https://admin.limosen.at/uploads/7-1601985268947.png';
const FLAG_SRC = 'https://limosen.at/flags/de.png';
const ABOUT_IMAGE = 'https://limosen.at/_nuxt/img/cars.3ec3e98.jpg';
const BOOKING_BACKGROUND = 'https://limosen.at/_nuxt/img/home-2.32cb6f9.jpg';

const FLEET_VEHICLES = [
  {
    name: 'Mercedes-Benz E Klasse',
    category: 'Business Class',
    description: 'E 350 d AMG Line - 2015 / 2016',
    image: 'https://admin.limosen.at/uploads/mercedes-benz-e-klasse%20e350d-1589814289680.jpg',
    passengers: 4,
    luggage: 3,
  },
  {
    name: 'Mercedes-Benz V Klasse',
    category: 'Business Class',
    description: 'V 250 d extralang - 2018',
    image: 'https://admin.limosen.at/uploads/vclass-1581462635925.jpeg',
    passengers: 7,
    luggage: 7,
  },
  {
    name: 'Mercedes-Benz S Klasse',
    category: 'First Class',
    description: 'S 400 d lang 4MATIC - 2020',
    image: 'https://admin.limosen.at/uploads/sclass-1581462643811.jpeg',
    passengers: 3,
    luggage: 2,
  },
  {
    name: 'Mercedes-Benz E Klasse',
    category: 'Business Class',
    description: 'E 220 d AMG Line - 2017 / 2018 / 2019',
    image: 'https://admin.limosen.at/uploads/eclass-1581462657307.jpeg',
    passengers: 4,
    luggage: 3,
  },
];

const FOOTER_LINK_GROUPS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Hauptseite', href: 'https://limosen.at/de' },
      { label: 'Unsere Fahrzeuge', href: 'https://limosen.at/de/cars' },
      { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
      { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
      { label: 'Jetzt buchen', href: 'https://limosen.at/de/booking' },
      { label: 'Impressum', href: 'https://limosen.at/de/page/imprint' },
      { label: 'Datenschutz', href: 'https://limosen.at/de/page/privacy' },
    ],
  },
  {
    title: 'Kontakt',
    links: [
      { label: CONTACT_PHONE, href: `https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}` },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Schreiben Sie uns', href: 'https://limosen.at/de/page/contact' },
    ],
  },
];

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showCookies, setShowCookies] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box minH="100vh" bg="#424242" color="whiteAlpha.900" display="flex" flexDirection="column">
      <Box as="header" className="main-wrapper">
        <HeaderBar />
        <TopNavigation />
      </Box>

      <Box as="main" flex="1" display="flex" flexDirection="column" gap={0} className="homepage">
        <HeroSection background={HERO_SLIDES[slideIndex]} />
        <AboutSection />
        <FleetSection />
        <OnlineBookingSection />
      </Box>

      <Footer />

      {showCookies && <CookieNotice onAccept={() => setShowCookies(false)} />}
    </Box>
  );
}

function HeaderBar() {
  return (
    <Box bg="#1b1b1b" py={2} className="header-bar">
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          gap={{ base: 2, md: 4 }}
        >
          <HStack spacing={3} className="header-bar__item">
            <Icon as={FaEnvelopeOpenText} color="#bb4338" />
            <Link href={`mailto:${CONTACT_EMAIL}`} color="#bb4338">
              {CONTACT_EMAIL}
            </Link>
          </HStack>
          <HStack spacing={3} className="header-bar__item">
            <Icon as={FaWhatsapp} color="#00e676" />
            <Link
              href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`}
              color="#00e676"
            >
              {CONTACT_PHONE}
            </Link>
          </HStack>
          <HStack spacing={3} ml={{ base: 0, md: 'auto' }}>
            {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
              <IconButton
                key={label}
                as={Link}
                href={href}
                aria-label={label}
                icon={<IconComponent />}
                isRound
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
                isExternal
              />
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function TopNavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      setMenuActive(false);
      onClose();
    } else {
      setMenuActive(true);
      onOpen();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuActive(false);
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  return (
    <Box
      pos="relative"
      overflow="hidden"
      backgroundColor="#dee9ec"
      height={isOpen ? 'calc(100vh + 15px)' : { base: '12vh', md: '15vh' }}
      minH={isOpen ? '600px' : '100px'}
      transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
    >
      <Box
        pos="relative"
        bg="#0f0f0f"
        color="white"
        transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
        height={isOpen ? 'max(600px, calc(100vh + 15px))' : '0'}
        minH={isOpen ? 'fit-content' : '0'}
        width="100%"
        overflow="hidden"
      >
        <Grid
          as={Container}
          maxW="6xl"
          minH="max(600px, calc(100vh + 15px))"
          templateRows={{ base: 'auto repeat(7, 1fr)', md: 'auto repeat(3, 1fr)' }}
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          templateAreas={{
            base: `"empty" "services" "team" "portfolio" "blog" "offices" "social"`,
            md: `"empty empty" "services team" "portfolio blog" "offices social"`,
          }}
          fontSize={{ base: 'xl', md: '2xl' }}
          h="full"
          w="full"
          gap={0}
        >
          <Box gridArea="empty" h={{ base: '12vh', md: '15vh' }} minH="100px" />
          <LinkBox
            gridArea="services"
            display="flex"
            alignItems="center"
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderLeft="0"
            borderBottom="0"
            borderColor="rgba(255, 255, 255, 0.08)"
            transition="color 0.2s"
            _hover={{ color: '#bb4338' }}
          >
            <LinkOverlay href="https://limosen.at/de/cars">Unsere Fahrzeuge</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="team"
            display="flex"
            alignItems="center"
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderBottom="0"
            borderLeft={{ base: '1px', md: '0' }}
            borderColor="rgba(255, 255, 255, 0.08)"
            transition="color 0.2s"
            _hover={{ color: '#bb4338' }}
          >
            <LinkOverlay href="https://limosen.at/de/feedback">Kundenfeedback</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="portfolio"
            display="flex"
            alignItems="center"
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderLeft="0"
            borderBottom="0"
            borderColor="rgba(255, 255, 255, 0.08)"
            transition="color 0.2s"
            _hover={{ color: '#bb4338' }}
          >
            <LinkOverlay href="https://limosen.at/de/booking">Jetzt buchen</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="blog"
            display="flex"
            alignItems="center"
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderBottom="1px"
            borderLeft={{ base: '1px', md: '0' }}
            borderColor="rgba(255, 255, 255, 0.08)"
            transition="color 0.2s"
            _hover={{ color: '#bb4338' }}
          >
            <LinkOverlay href="https://limosen.at/de/page/contact">Kontakt</LinkOverlay>
          </LinkBox>
          <Box
            gridArea="offices"
            pt={{ base: 8 }}
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderTop="1px"
            borderBottom="0"
            borderLeft="0"
            borderRight={{ base: '1px', md: '0' }}
            borderColor={{ base: 'transparent', md: 'rgba(255, 255, 255, 0.08)' }}
          >
            <Text color="white" fontWeight="bold" fontSize="lg" pb={2}>
              Immer erreichbar
            </Text>
            <VStack align="flex-start" spacing={2} color="whiteAlpha.800" fontSize="md">
              <Link href={`tel:${CONTACT_PHONE_TEL}`} color="whiteAlpha.900">
                {CONTACT_PHONE}
              </Link>
              <Link href={`mailto:${CONTACT_EMAIL}`} color="whiteAlpha.900">
                {CONTACT_EMAIL}
              </Link>
              <Text color="whiteAlpha.700">Wien, Österreich</Text>
            </VStack>
          </Box>
          <Box
            gridArea="social"
            pt={{ base: 8 }}
            pl={{ base: 8, md: 16 }}
            borderWidth="1px"
            borderTop="0"
            borderBottom="0"
            borderLeft="0"
            borderColor="rgba(255, 255, 255, 0.08)"
          >
            <Text color="white" fontWeight="bold" fontSize="lg" mb={3}>
              Folgen Sie uns
            </Text>
            <HStack spacing={6}>
              {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
                <Link
                  key={label}
                  href={href}
                  isExternal
                  color="white"
                  transition="color 0.2s"
                  _hover={{ color: '#bb4338' }}
                >
                  <Icon as={IconComponent} boxSize={6} />
                </Link>
              ))}
            </HStack>
          </Box>
        </Grid>
      </Box>
      <Container maxW="6xl" pos="absolute" inset={0} pointerEvents="none">
        <Flex
          h={{ base: '12vh', md: '15vh' }}
          minH="100px"
          align="center"
          px={{ base: 4, md: 6 }}
          py={{ base: 2, md: 4 }}
          justify="space-between"
          pointerEvents="auto"
        >
          <Link href="https://limosen.at" display="flex" alignItems="center" height="100%">
            <Image src={LOGO_SRC} alt="Limosen KG" height={{ base: 16, md: 20 }} objectFit="contain" />
          </Link>
          <Flex align="center" gap={{ base: 2, lg: 4 }}>
            <Flex display={{ base: 'none', lg: 'flex' }} align="center" gap={2}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  as={Link}
                  href={link.href}
                  variant="ghost"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="#273E53"
                  _hover={{ color: '#bb4338', bg: 'whiteAlpha.200' }}
                >
                  {link.label}
                </Button>
              ))}
            </Flex>
            <HStack spacing={2} display="flex">
              <Tooltip label="Deutsch" hasArrow>
                <Image src={FLAG_SRC} alt="Deutsch" boxSize={6} />
              </Tooltip>
              <Text fontWeight="semibold" color="#273E53">
                DE
              </Text>
              <Button
                as={Link}
                href="https://limosen.at/en"
                size="sm"
                variant="outline"
                color="#273E53"
                borderColor="#273E53"
                _hover={{ bg: 'white', color: '#bb4338', borderColor: '#bb4338' }}
              >
                Change
              </Button>
            </HStack>
            <Button
              as={Link}
              href="https://limosen.at/de/booking"
              size="sm"
              bg="#bb4338"
              color="white"
              _hover={{ bg: '#a1382f' }}
            >
              Jetzt Buchen
            </Button>
            <IconButton
              aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
              icon={<Icon as={FaBars} boxSize={5} />}
              variant="ghost"
              onClick={toggleMenu}
              color={menuActive ? 'white' : '#273E53'}
              bg={menuActive ? '#bb4338' : 'transparent'}
              _hover={{ bg: menuActive ? '#a1382f' : 'rgba(0,0,0,0.08)' }}
              display={{ base: 'flex', lg: 'none' }}
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

function HeroSection({ background }) {
  return (
    <Box
      as="section"
      className="slider-wrapper"
      bgImage={`url('${background}')`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      minH={{ base: '320px', md: '540px' }}
    />
  );
}

function AboutSection() {
  return (
    <Box as="section" bg="#2f2f2f" py={{ base: 12, md: 20 }} className="about-us">
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 8, md: 12 }} align="stretch">
          <VStack align="flex-start" spacing={6} flex="1" className="about-text">
            <Heading size="lg" className="about-text__title">
              Über uns
            </Heading>
            <Stack spacing={4} fontSize="lg" className="about-description">
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
                Kundenzufriedenheit ist unsere oberste Priorität und unser Unternehmen übt die Destinationen in unserem Portfolio in
                bester Weise aus, um unseren Kunden die höchste Qualität zu bieten.
              </Text>
            </Stack>
          </VStack>
          <Box
            flex={{ base: 'none', md: '0 0 40%' }}
            minH={{ base: '240px', md: '320px' }}
            borderRadius="lg"
            className="about-image"
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

function FleetSection() {
  return (
    <Box as="section" bg="#1b1b1b" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <VStack spacing={10} align="stretch">
          <Heading size="lg" textAlign="center">
            Unsere Fahrzeugflotte
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 10 }}>
            {FLEET_VEHICLES.map((vehicle) => (
              <Box
                key={vehicle.image}
                bg="#252525"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
              >
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  w="full"
                  h={{ base: '220px', md: '260px' }}
                  objectFit="cover"
                />
                <Stack spacing={3} p={6}>
                  <Heading size="md">{vehicle.name}</Heading>
                  <Text fontWeight="semibold" color="whiteAlpha.700">
                    {vehicle.category}
                  </Text>
                  <Text color="whiteAlpha.800">{vehicle.description}</Text>
                  <Wrap spacing={6} pt={2}>
                    <WrapItem>
                      <HStack spacing={2}>
                        <Icon as={FaUser} color="#319fb9" />
                        <Text color="whiteAlpha.800" fontWeight="medium">
                          Passagieranzahl: {vehicle.passengers}
                        </Text>
                      </HStack>
                    </WrapItem>
                    <WrapItem>
                      <HStack spacing={2}>
                        <Icon as={FaSuitcaseRolling} color="#319fb9" />
                        <Text color="whiteAlpha.800" fontWeight="medium">
                          Gepäckanzahl: {vehicle.luggage}
                        </Text>
                      </HStack>
                    </WrapItem>
                  </Wrap>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

function OnlineBookingSection() {
  return (
    <Box
      as="section"
      bg="#1f1f1f"
      py={{ base: 12, md: 16 }}
      className="online-booking"
      bgImage={`url('${BOOKING_BACKGROUND}')`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    >
      <Container maxW="4xl">
        <VStack spacing={5} textAlign="center">
          <Heading size="md" className="online-booking__title">
            Buchen sie heute und lassen Sie uns den Komfort Ihrer Reise berücksichtigen.
          </Heading>
          <Stack spacing={3} fontSize="lg" className="online-booking__sub-title">
            <Text>Sie können uns telefonisch</Text>
            <HStack justify="center" spacing={2}>
              <Icon as={FaPhone} color="yellow.300" />
              <Link href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`} color="white">
                {CONTACT_PHONE}
              </Link>
            </HStack>
            <Text>und</Text>
            <Text>auch mit einer E-Mail erreichen</Text>
            <HStack justify="center" spacing={2}>
              <Icon as={FaEnvelopeOpen} color="yellow.300" />
              <Link href={`mailto:${CONTACT_EMAIL}`} color="white">
                {CONTACT_EMAIL}
              </Link>
            </HStack>
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
    <Box as="footer" bg="#0f0f0f" py={{ base: 12, md: 16 }}>
      <Container maxW="6xl">
        <VStack spacing={{ base: 10, md: 14 }} align="stretch">
          <Flex direction={{ base: 'column', md: 'row' }} align="flex-start" gap={{ base: 8, md: 14 }}>
            <Box flexShrink={0}>
              <Image src={LOGO_SRC} alt="Limosen KG" h={{ base: 14, md: 16 }} objectFit="contain" />
              <Text mt={4} color="whiteAlpha.700">
                Premium Chauffeur-Service in Wien und darüber hinaus.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 8, md: 10 }} flex="1">
              {FOOTER_LINK_GROUPS.map((group) => (
                <VStack key={group.title} spacing={4} align="flex-start">
                  <Text fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                    {group.title}
                  </Text>
                  <VStack spacing={2} align="flex-start">
                    {group.links.map((link) => (
                      <Link key={link.label} href={link.href} color="whiteAlpha.700" _hover={{ color: 'white' }}>
                        {link.label}
                      </Link>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </Flex>
          <Divider borderColor="whiteAlpha.200" />
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={4}>
            <Text fontSize="sm" color="whiteAlpha.700">
              © {new Date().getFullYear()} LIMOSEN KG. Alle Rechte vorbehalten.
            </Text>
            <Wrap spacing={3}>
              {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
                <WrapItem key={label}>
                  <IconButton
                    as={Link}
                    href={href}
                    aria-label={label}
                    icon={<IconComponent />}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    isRound
                    size="sm"
                    isExternal
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

function CookieNotice({ onAccept }) {
  return (
    <Box
      className="cookie-notice"
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
            <Link href="https://limosen.at/de/page/privacy" fontWeight="medium" color="yellow.300">
              Datenschutzerklärung
            </Link>
            <Button colorScheme="yellow" onClick={onAccept} size="sm">
              Akzeptieren
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

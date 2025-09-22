import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
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
  { label: 'Service', href: '#services' },
  { label: 'Hauptseite', href: 'https://limosen.at/de' },
  { label: 'Unsere Fahrzeuge', href: '#fahrzeuge' },
  { label: 'Kundenfeedback', href: 'https://limosen.at/de/feedback' },
  { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
  { label: 'Kontakt', href: 'https://limosen.at/de/page/contact' },
];

const SERVICE_LINKS = [
  { label: 'Flughafentransfer', href: '#flughafentransfer' },
  { label: 'Stadtreise', href: '#stadtreise' },
  { label: 'Individueller Fahrer-Service', href: '#individueller-fahrer-service' },
  { label: 'Institutionelle Dienstleistungen', href: '#institutionelle-dienstleistungen' },
  { label: 'Ortschaftstransfer', href: '#ortschaftstransfer' },
  { label: 'Auslandtransfer', href: '#auslandtransfer' },
  { label: 'Transfer Zwischen Den Bundesländern', href: '#transfer-zwischen-den-bundeslaendern' },
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

const SERVICE_NAVIGATION_EVENT = 'service-accordion:navigate';

function emitServiceNavigation(target) {
  if (typeof window === 'undefined' || !target) {
    return;
  }

  const targetId = target.replace(/^#/, '');

  window.dispatchEvent(
    new CustomEvent(SERVICE_NAVIGATION_EVENT, {
      detail: targetId,
    })
  );
}

function handleServiceLinkClick(event, targetHref) {
  if (!targetHref || !targetHref.startsWith('#')) {
    return;
  }

  event?.preventDefault();
  emitServiceNavigation(targetHref);
}

const FAQ_ITEMS = [
  {
    question: 'Welche Fahrzeugklassen stehen zur Auswahl?',
    answer:
      'Unsere Flotte umfasst Business- und First-Class-Modelle wie die Mercedes-Benz E Klasse, die V Klasse für Gruppen sowie die luxuriöse S Klasse für repräsentative Anlässe.',
  },
  {
    question: 'Wie läuft der Flughafentransfer ab?',
    answer:
      'Ihre vorgebuchten Chauffeure warten direkt am Flughafen, übernehmen Ihr Gepäck und bringen Sie ohne Wartezeiten sicher und komfortabel an Ihr Ziel – auf Wunsch auch wieder zurück.',
  },
  {
    question: 'Gibt es Kindersitze oder mehrsprachige Fahrer?',
    answer:
      'Auf Anfrage stellen wir Kindersitze, mehrsprachige Chauffeure in formeller Kleidung sowie bei Bedarf Übersetzer zur Verfügung, damit jede Fahrt Ihren Erwartungen entspricht.',
  },
  {
    question: 'Sind internationale Transfers möglich?',
    answer:
      'Ja, wir organisieren Auslandsfahrten zu Destinationen wie Bratislava, Budapest, Prag oder Venedig und begleiten Sie mit Tracking-System und persönlichem Service während der gesamten Reise.',
  },
];

const SERVICES_CONTENT = [
  {
    id: 'flughafentransfer',
    title: 'Flughafentransfer',
    image: 'https://admin.limosen.at/uploads/airport-transfer-1581462786357.jpg',
    paragraphs: [
      'Am internationalen Flughafen Wien bieten wir Ihnen mit dem professionellsten Transferservice der Stadt Luxus und Komfort.',
      'Unsere, speziell für Sie eingerichteten vorgebuchten Luxusfahrzeuge warten mit erfahrenen Fahrern am Flughafen auf Ihre Transfer-Anordnungen.',
      'Um Ihr Ziel nach Ihrer Landung zu erreichen, können sie sich sofort ein Fahrzeug zuteilen lassen.',
      'Wir verhelfen Ihnen zu einem dynamischeren und energischeren Start in Ihren Urlaub und auf gleiche Weise, bringen wir Sie nach Ihrem Urlaub wieder auf den Flughafen zurück.',
    ],
  },
  {
    id: 'stadtreise',
    title: 'Stadtreise',
    image: 'https://admin.limosen.at/uploads/driver-1581462805549.jpg',
    paragraphs: [
      'Durch unseren Tour-Service zu allen touristischen Orten innerhalb Österreichs, bieten wir durch unsere Mercedes-Benz-Fahrzeuge Luxus und Komfort in Einem.',
      'Mit unseren kompetenten Fahrern reisen Sie auf festgelegten Routen und finden Gelegenheit, die kulturelle, historische Struktur und Naturschönheiten Österreichs zu besichtigen.',
      'Wir haben Touren zum Stephansdom, nach Hofburg, Schönbrunn, Kahlenberg, zur Salzburger Altstadt, Seepromenade, nach Hallstadt, Eisriesenwelt, zum Gollinger Wasserfall und noch zu vielen sehenswerten Orten.',
      'Während Ihrer Tour sind wir für Ihre Sicherheit und Gelassenheit verantwortlich und wählen daher die praktischste, sicherste und einfachste Route aus.',
      'Unser Unternehmen entwickelt sich diesbezüglich ständig weiter und ist bestrebt, seinen Gästen immer hochwertigen Service anzubieten.',
      'Während Sie unsere sicheren und komfortablen Standards genießen, möchten wir Sie noch einmal darauf aufmerksam machen, dass Sie von allen Top-Einrichtungen, die wir Ihnen in unseren neuesten Mercedes-Benz Fahrzeugen anbieten, profitieren können.',
      'Wenn Sie möchten, können Sie Ihre Tour in Begleitung des von uns zugewiesenen Reiseleiters durchführen, ein angenehmeres und besonderes Erlebnis haben und unvergessliche Erinnerungen sammeln.',
    ],
  },
  {
    id: 'individueller-fahrer-service',
    title: 'Individueller Fahrer-Service',
    image: 'https://admin.limosen.at/uploads/limousine-1581462830996.jpg',
    paragraphs: [
      'Wenn Sie zum Beispiel ein Meeting in Wien haben, einen Gast herumführen oder bequem zu Ihrer Arbeit fahren möchten benötigen Sie möglicherweise ein VIP-Fahrzeug der Marken Mercedes-Benz V-Klasse (Business Van), S-Klasse (First Class) und E-Klasse (Business Class).',
      'Wenn Sie nach einem luxuriösen und komfortablen Service suchen, sind Sie hier richtig.',
      'Wir garantieren Ihnen, dass die Zeit, die Sie im Verkehr verbringen, blitzschnell vergehen wird und die Umweltfaktoren keinen Einfluss auf Sie haben werden.',
      'Darüber hinaus bieten wir Dienstleistungen wie privaten Fahrer mit Fremdsprachenkenntnissen und formeller Kleidung und auf Wunsch private Übersetzer an. Somit genießen Sie einen bequemeren Aufenthalt.',
      'Da wir in jeder Hinsicht an Ihre Sicherheit und natürlich auch an die Sicherheit Ihrer Kinder denken, befindet sich im Fahrzeug auch ein Kindersitz.',
      'Somit verbringen Sie eine sichere Fahrt im Verkehr und brauchen sich auch keine Sorgen um die Sicherheit Ihres Kindes zu machen.',
      'Da private Transfers nach den Ankunftszeiten der Gäste organisiert werden, gibt es an den Flughäfen keine Wartezeit.',
      'An den Ankunftsorten werden unsere Gäste von unseren Mitarbeitern empfangen und zu den Fahrzeugen geleitet, die sie transportieren werden.',
      'Auf diese Weise gelangen sie zum richtigen Fahrzeug.',
      'In unserem VIP-Fahrzeug der Marke Mercedes-Benz können Sie sich sicher und geborgen fühlen.',
      'Obgleich unsere Mitarbeiter alles mögliche unternehmen werden, um Ihren Komfort und Ihre Bequemlichkeit zu gewährleisten, können Sie sich bezüglich Ihrer zusätzlichen Bedürfnisse an unser Unternehmen wenden und Anfragen stellen.',
      'Da unsere Prinzipien auf Gastfreundschaft basieren, sind wir bestrebt unseren Gästen so gut wie möglich behilflich zu sein.',
    ],
  },
  {
    id: 'institutionelle-dienstleistungen',
    title: 'Institutionelle Dienstleistungen',
    image: null,
    paragraphs: [
      'Aufgrund unserer jahrelangen Erfahrung, versichern wir, dass alle, durch uns erbrachten Dienste im Rahmen eines gut durchdachten Planes und Programms erstellt wurden und unsere Qualitätsstandards ständig aktualisiert und an die weltweite Konjunktur angepasst werden.',
      'Für die Transportanforderungen Ihres Unternehmens können Sie, indem Sie uns Informationen über Destinationen weitergeben, günstige Preisangebote erhalten und von unseren Pauschalpreisen profitieren.',
      '• Organisationstransfers',
      '• Touristischer Transfers',
      '• Sportmannschaftstransfers',
      '• Eröffnung, Feier Transfers',
      '• Unternehmens- und Gewerkschaftstransfers',
      '• Gruppentransfers',
      '• Roadshow-Transfers',
      '• Messentransfer',
      '• Fahrzeugsoptionen in verschiedenen Segmenten',
      'Wir bieten Lösungen in den Bereichen institutioneller Verkauf, Fahrzeugzuteilung. Jede bestätigte Reservierung, ist eine Zusage an Sie.',
    ],
  },
  {
    id: 'ortschaftstransfer',
    title: 'Ortschaftstransfer',
    image: null,
    paragraphs: [
      'Das Exclusive Austrian Transfer Team holt Sie vom Hotel, Wohnort, Adresse oder Aufenthaltsort, den Sie angegeben haben, ohne Wartezeiten ab und bringt Sie unabhängig von der Fahrstrecke unter Genuss einer hochwertigen Fahrt zum gewünschten Ankunftsort.',
      'Anhand unserer Erfahrung in diesem Bereich bestimmen wir Ihre Route mit großer Sorgfalt und wählen die praktischste, sicherste und einfachste Route, um die Zeit, die sie im Verkehr verbringen werden, zu minimieren.',
    ],
  },
  {
    id: 'auslandtransfer',
    title: 'Auslandtransfer',
    image: null,
    paragraphs: [
      'Der Flughafen von Wien, eine der zentralsten Hauptstädte Europas, ist aufgrund seiner Lage der wichtigste Punkt für internationale Transfers.',
      'Als Flughafen-Transferservice empfangen wir Sie, tragen Ihr Gepäck vorsichtig bis zum Fahrzeug und bringen Sie zu Ihrer gewünschten Destination wie z.B. Bratislava, Budapest, Prag, Venedig und weitere Orte innerhalb der Schengen-Ländern.',
      'Gemäß unserer Unternehmensrichtlinien ist die Sicherheit unserer Kunden für uns einer der wichtigsten Faktoren.',
      'Wir werden Sie bis zu Ihrer Ankunft in unseren Fahrzeugen begleiten und dank unserem Fahrzeug-Tracking-System werden Sie sich immer sicher fühlen und Ihre Reise genießen.',
    ],
  },
  {
    id: 'transfer-zwischen-den-bundeslaendern',
    title: 'Transfer Zwischen Den Bundesländern',
    image: null,
    paragraphs: [
      'Die Bundesrepublik Österreich besteht aus neun Bundesländern. Wien, Niederösterreich, Oberösterreich, Steiermark, Tirol, Kärnten, Salzburg, Vorarlberg, Burgenland.',
      'In Österreich, wo Reisen zwischen den Bundesländern sehr intensiv sind, sorgen wir dafür, dass Sie nach Ihrer Landung wenn Sie kein Fahrzeug bereit haben oder öffentliche Verkehrsmittel aus zeitlichen Gründen nicht nutzen können, mit oder ohne Reservierung, sicher ihr Zielort erreichen.',
    ],
  },
];

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

function useServiceAccordionNavigation(serviceIds) {
  const idToIndex = useMemo(() => {
    const mapping = {};
    serviceIds.forEach((id, index) => {
      mapping[id] = index;
    });
    return mapping;
  }, [serviceIds]);

  const [expandedIndices, setExpandedIndices] = useState([]);
  const pendingScrollIdRef = useRef(null);

  const scrollToService = useCallback((id) => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      window.requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  const openServiceById = useCallback(
    (targetId) => {
      if (!targetId || !(targetId in idToIndex)) {
        return;
      }

      const index = idToIndex[targetId];
      pendingScrollIdRef.current = targetId;
      setExpandedIndices([index]);
    },
    [idToIndex]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      openServiceById(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openServiceById]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleNavigation = (event) => {
      const targetId = typeof event.detail === 'string' ? event.detail : '';
      if (!targetId) {
        return;
      }

      openServiceById(targetId);

      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== targetId) {
        window.history?.pushState?.(null, '', `#${targetId}`);
      }
    };

    window.addEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation);
    return () => window.removeEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation);
  }, [openServiceById]);

  useEffect(() => {
    if (!pendingScrollIdRef.current) {
      return;
    }

    const targetId = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;
    scrollToService(targetId);
  }, [expandedIndices, scrollToService]);

  const handleAccordionChange = useCallback((value) => {
    if (Array.isArray(value)) {
      setExpandedIndices(value);
    } else if (typeof value === 'number') {
      setExpandedIndices([value]);
    } else {
      setExpandedIndices([]);
    }
  }, []);

  return {
    expandedIndices,
    handleAccordionChange,
  };
}

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
        <ServicesSection />
        <FAQSection />
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
      backgroundColor="#1c1c1c"
      height={isOpen ? 'calc(100vh + 15px)' : { base: '12vh', md: '15vh' }}
      minH={isOpen ? '600px' : '100px'}
      transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
    >
      <Box
        pos="relative"
        bg="#1c1c1c"
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
            <LinkOverlay href="#fahrzeuge">Unsere Fahrzeuge</LinkOverlay>
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
                  color="#f5f5f5"
                  _hover={{ color: '#bb4338', bg: 'whiteAlpha.200' }}
                >
                  {link.label}
                </Button>
              ))}
            </Flex>
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                variant="ghost"
                color="#f5f5f5"
                px={2}
                _hover={{ bg: 'whiteAlpha.200' }}
                _expanded={{ bg: 'whiteAlpha.200' }}
                rightIcon={<ChevronDownIcon color="#f5f5f5" />}
              >
                <HStack spacing={2}>
                  <Tooltip label="Deutsch" hasArrow>
                    <Image src={FLAG_SRC} alt="Deutsch" boxSize={6} />
                  </Tooltip>
                  <Text fontWeight="semibold" color="#f5f5f5">
                    DE
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList bg="#1c1c1c" borderColor="rgba(255, 255, 255, 0.1)" color="white">
                <MenuItem
                  as={Link}
                  href="https://limosen.at/en"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <Image src="https://limosen.at/flags/en.png" alt="English" boxSize={8} />
                  <Text>English</Text>
                </MenuItem>
                <MenuItem
                  as={Link}
                  href="https://limosen.at/tr"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <Image src="https://limosen.at/flags/tr.png" alt="Türkçe" boxSize={8} />
                  <Text>Türkçe</Text>
                </MenuItem>
              </MenuList>
            </Menu>
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

function ServicesSection() {
  const serviceIds = useMemo(() => SERVICES_CONTENT.map((service) => service.id), []);
  const { expandedIndices, handleAccordionChange } = useServiceAccordionNavigation(serviceIds);

  const createContentBlocks = (paragraphs) => {
    const blocks = [];
    let listItems = [];

    paragraphs.forEach((paragraph) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('•')) {
        listItems.push(trimmed.replace(/^•\s*/, ''));
      } else {
        if (listItems.length) {
          blocks.push({ type: 'list', items: listItems });
          listItems = [];
        }
        blocks.push({ type: 'text', text: paragraph });
      }
    });

    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems });
    }

    return blocks;
  };

  const summaryText = (paragraphs) => {
    const firstParagraph = paragraphs.find((paragraph) => !paragraph.trim().startsWith('•'));
    return firstParagraph || '';
  };

  return (
    <Box as="section" bg="#1b1b1b" py={{ base: 12, md: 20 }} id="services">
      <Container maxW="6xl">
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Unsere Services</Heading>
            <Text color="whiteAlpha.700" maxW="3xl">
              Erhalten Sie einen schnellen Überblick über unser Angebot und vertiefen Sie sich bei Bedarf in die
              detaillierten Beschreibungen unserer Premium-Services.
            </Text>
            <Divider borderColor="whiteAlpha.300" w={{ base: '80px', md: '120px' }} />
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {SERVICES_CONTENT.map((service) => {
              const targetHref = `#${service.id}`;

              return (
                <LinkBox
                  key={service.id}
                  id={`${service.id}-overview`}
                  bg="#252525"
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  boxShadow="lg"
                  role="group"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                >
                  {service.image && (
                    <Box h="160px" overflow="hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        w="full"
                        h="full"
                        objectFit="cover"
                        transform="scale(1)"
                        transition="transform 0.4s"
                        _groupHover={{ transform: 'scale(1.05)' }}
                      />
                    </Box>
                  )}
                  <Box p={6}>
                    <LinkOverlay
                      href={targetHref}
                      display="block"
                      onClick={(event) => handleServiceLinkClick(event, targetHref)}
                    >
                      <Stack spacing={3}>
                        <Heading size="sm">{service.title}</Heading>
                        <Text color="whiteAlpha.800" fontSize="sm" noOfLines={3}>
                          {summaryText(service.paragraphs)}
                        </Text>
                        <Text fontWeight="semibold" color="#bb4338">
                          Mehr erfahren →
                        </Text>
                      </Stack>
                    </LinkOverlay>
                  </Box>
                </LinkBox>
              );
            })}
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4} textAlign="center">
              Details zu unseren Leistungen
            </Heading>
            <Accordion
              allowMultiple
              reduceMotion
              index={expandedIndices}
              onChange={handleAccordionChange}
            >
              {SERVICES_CONTENT.map((service) => {
                const blocks = createContentBlocks(service.paragraphs);
                const hasImage = Boolean(service.image);

                return (
                  <AccordionItem
                    key={service.id}
                    id={service.id}
                    border="none"
                    mb={4}
                    scrollMarginTop={{ base: '120px', md: '160px' }}
                  >
                    <h3>
                      <AccordionButton
                        bg="rgba(255, 255, 255, 0.04)"
                        _expanded={{ bg: 'rgba(187, 67, 56, 0.2)', color: '#fff' }}
                        borderRadius="lg"
                        px={{ base: 4, md: 6 }}
                        py={{ base: 4, md: 5 }}
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                      >
                        <Box flex="1" textAlign="left" fontWeight="semibold">
                          {service.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel px={{ base: 4, md: 6 }} pt={6} pb={2}>
                      <Stack
                        spacing={6}
                        direction={{ base: 'column', md: hasImage ? 'row' : 'column' }}
                        align={{ base: 'stretch', md: 'flex-start' }}
                      >
                        {hasImage && (
                          <Image
                            src={service.image}
                            alt={service.title}
                            borderRadius="lg"
                            maxW={{ base: '100%', md: '320px' }}
                            objectFit="cover"
                            boxShadow="lg"
                          />
                        )}
                        <Stack spacing={4} color="whiteAlpha.900" fontSize="md" flex="1">
                          {blocks.map((block, blockIndex) => {
                            if (block.type === 'list') {
                              return (
                                <List key={blockIndex} spacing={2} pl={4} styleType="disc">
                                  {block.items.map((item, itemIndex) => (
                                    <ListItem key={itemIndex}>{item}</ListItem>
                                  ))}
                                </List>
                              );
                            }
                            return <Text key={blockIndex}>{block.text}</Text>;
                          })}
                        </Stack>
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

function FAQSection() {
  return (
    <Box as="section" bg="#1b1b1b" py={{ base: 12, md: 20 }}>
      <Container maxW="5xl">
        <VStack spacing={{ base: 8, md: 10 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Häufig gestellte Fragen</Heading>
            <Text color="whiteAlpha.700" maxW="3xl">
              Antworten auf die wichtigsten Fragen zu Buchung, Fahrzeugen und unserem Premium-Service.
            </Text>
            <Divider borderColor="whiteAlpha.300" w={{ base: '80px', md: '120px' }} />
          </VStack>
          <Accordion allowToggle reduceMotion>
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.question} border="none" mb={3}>
                <h3>
                  <AccordionButton
                    bg="rgba(255, 255, 255, 0.04)"
                    _expanded={{ bg: 'rgba(187, 67, 56, 0.2)', color: '#fff' }}
                    borderRadius="lg"
                    px={{ base: 4, md: 6 }}
                    py={{ base: 4, md: 5 }}
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                  >
                    <Box flex="1" textAlign="left" fontWeight="semibold">
                      {item.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={{ base: 4, md: 6 }} pt={4} pb={6} color="whiteAlpha.900">
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>
    </Box>
  );
}

function FleetSection() {
  return (
    <Box as="section" id="fahrzeuge" bg="#1b1b1b" py={{ base: 12, md: 20 }}>
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

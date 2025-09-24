import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Box,
  BoxProps,
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
  LinkBox,
  LinkOverlay,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { Field } from 'jaen';
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

import { Link } from 'gatsby-plugin-jaen';

const CONTACT_EMAIL = 'office@limosen.at';
const CONTACT_PHONE = '+43 660 876 06 06';
const CONTACT_PHONE_TEL = '+436608760606';

const NAV_LINKS = [
  { label: 'Hauptseite', href: '/' },
  { label: 'Service', href: '#services' },
  { label: 'Unsere Fahrzeuge', href: '#fahrzeuge' },
  { label: 'Kundenfeedback', href: '#kundenfeedback' }, // stay on page
  { label: 'Registrieren', href: 'https://limosen.at/de/register/driver' },
  { label: 'Kontakt', href: '?contact' },
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
  '/images/everything/hero-beauty-of-vienna.jpg',
  '/images/everything/hero-whatsapp-1.jpeg',
  '/images/everything/hero-whatsapp-2.jpeg',
  '/images/everything/hero-whatsapp-3.jpeg',
  '/images/everything/hero-vienna-cityscape.jpg',
  '/images/everything/hero-whatsapp-4.jpeg',
  '/images/everything/hero-hofburg-night.jpg',
];

const LOGO_SRC = '/images/everything/logo.png';
const FLAG_DE = '/images/everything/flag-de.png';
const FLAG_EN = '/images/everything/flag-en.png';
const FLAG_TR = '/images/everything/flag-tr.png';
const ABOUT_IMAGE = '/images/everything/about-cars.jpg';
const BOOKING_BACKGROUND = '/images/everything/booking-background.jpg';

const SERVICE_NAVIGATION_EVENT = 'service-accordion:navigate';

function emitServiceNavigation(target: string) {
  if (typeof window === 'undefined' || !target) return;
  const targetId = target.replace(/^#/, '');
  window.dispatchEvent(new CustomEvent(SERVICE_NAVIGATION_EVENT, { detail: targetId }));
}

function handleServiceLinkClick(event: React.MouseEvent, targetHref?: string) {
  if (!targetHref || !targetHref.startsWith('#')) return;
  event?.preventDefault();
  emitServiceNavigation(targetHref);
}

const FAQ_ITEMS = [
  { question: 'Welche Fahrzeugklassen stehen zur Auswahl?', answer: 'Unsere Flotte umfasst Business- und First-Class-Modelle wie die Mercedes-Benz E Klasse, die V Klasse für Gruppen sowie die luxuriöse S Klasse für repräsentative Anlässe.' },
  { question: 'Wie läuft der Flughafentransfer ab?', answer: 'Ihre vorgebuchten Chauffeure warten direkt am Flughafen, übernehmen Ihr Gepäck und bringen Sie ohne Wartezeiten sicher und komfortabel an Ihr Ziel – auf Wunsch auch wieder zurück.' },
  { question: 'Gibt es Kindersitze oder mehrsprachige Fahrer?', answer: 'Auf Anfrage stellen wir Kindersitze, mehrsprachige Chauffeure in formeller Kleidung sowie bei Bedarf Übersetzer zur Verfügung, damit jede Fahrt Ihren Erwartungen entspricht.' },
  { question: 'Sind internationale Transfers möglich?', answer: 'Ja, wir organisieren Auslandsfahrten zu Destinationen wie Bratislava, Budapest, Prag oder Venedig und begleiten Sie mit Tracking-System und persönlichem Service während der gesamten Reise.' },
];

const SERVICES_CONTENT = [
  { id: 'flughafentransfer', title: 'Flughafentransfer', image: '/images/everything/service-airport-transfer.jpg', paragraphs: [ 'Am internationalen Flughafen Wien bieten wir Ihnen mit dem professionellsten Transferservice der Stadt Luxus und Komfort.', 'Unsere, speziell für Sie eingerichteten vorgebuchten Luxusfahrzeuge warten mit erfahrenen Fahrern am Flughafen auf Ihre Transfer-Anordnungen.', 'Um Ihr Ziel nach Ihrer Landung zu erreichen, können sie sich sofort ein Fahrzeug zuteilen lassen.', 'Wir verhelfen Ihnen zu einem dynamischeren und energischeren Start in Ihren Urlaub und auf gleiche Weise, bringen wir Sie nach Ihrem Urlaub wieder auf den Flughafen zurück.', ], },
  { id: 'stadtreise', title: 'Stadtreise', image: '/images/everything/service-driver.jpg', paragraphs: [ 'Durch unseren Tour-Service zu allen touristischen Orten innerhalb Österreichs, bieten wir durch unsere Mercedes-Benz-Fahrzeuge Luxus und Komfort in Einem.', 'Mit unseren kompetenten Fahrern reisen Sie auf festgelegten Routen und finden Gelegenheit, die kulturelle, historische Struktur und Naturschönheiten Österreichs zu besichtigen.', 'Wir haben Touren zum Stephansdom, nach Hofburg, Schönbrunn, Kahlenberg, zur Salzburger Altstadt, Seepromenade, nach Hallstadt, Eisriesenwelt, zum Gollinger Wasserfall und noch zu vielen sehenswerten Orten.', 'Während Ihrer Tour sind wir für Ihre Sicherheit und Gelassenheit verantwortlich und wählen daher die praktischste, sicherste und einfachste Route aus.', 'Unser Unternehmen entwickelt sich diesbezüglich ständig weiter und ist bestrebt, seinen Gästen immer hochwertigen Service anzubieten.', 'Während Sie unsere sicheren und komfortablen Standards genießen, möchten wir Sie noch einmal darauf aufmerksam machen, dass Sie von allen Top-Einrichtungen, die wir Ihnen in unseren neuesten Mercedes-Benz Fahrzeugen anbieten, profitieren können.', 'Wenn Sie möchten, können Sie Ihre Tour in Begleitung des von uns zugewiesenen Reiseleiters durchführen, ein angenehmeres und besonderes Erlebnis haben und unvergessliche Erinnerungen sammeln.', ], },
  { id: 'individueller-fahrer-service', title: 'Individueller Fahrer-Service', image: '/images/everything/service-limousine.jpg', paragraphs: [ 'Wenn Sie zum Beispiel ein Meeting in Wien haben, einen Gast herumführen oder bequem zu Ihrer Arbeit fahren möchten benötigen Sie möglicherweise ein VIP-Fahrzeug der Marken Mercedes-Benz V-Klasse (Business Van), S-Klasse (First Class) und E-Klasse (Business Class).', 'Wenn Sie nach einem luxuriösen und komfortablen Service suchen, sind Sie hier richtig.', 'Wir garantieren Ihnen, dass die Zeit, die Sie im Verkehr verbringen, blitzschnell vergehen wird und die Umweltfaktoren keinen Einfluss auf Sie haben werden.', 'Darüber hinaus bieten wir Dienstleistungen wie privaten Fahrer mit Fremdsprachenkenntnissen und formeller Kleidung und auf Wunsch private Übersetzer an. Somit genießen Sie einen bequemeren Aufenthalt.', 'Da wir in jeder Hinsicht an Ihre Sicherheit und natürlich auch an die Sicherheit Ihrer Kinder denken, befindet sich im Fahrzeug auch ein Kindersitz.', 'Somit verbringen Sie eine sichere Fahrt im Verkehr und brauchen sich auch keine Sorgen um die Sicherheit Ihres Kindes zu machen.', 'Da private Transfers nach den Ankunftszeiten der Gäste organisiert werden, gibt es an den Flughäfen keine Wartezeit.', 'An den Ankunftsorten werden unsere Gäste von unseren Mitarbeitern empfangen und zu den Fahrzeugen geleitet, die sie transportieren werden.', 'Auf diese Weise gelangen sie zum richtigen Fahrzeug.', 'In unserem VIP-Fahrzeug der Marke Mercedes-Benz können Sie sich sicher und geborgen fühlen.', 'Obgleich unsere Mitarbeiter alles mögliche unternehmen werden, um Ihren Komfort und Ihre Bequemlichkeit zu gewährleisten, können Sie sich bezüglich Ihrer zusätzlichen Bedürfnisse an unser Unternehmen wenden und Anfragen stellen.', 'Da private Transfers nach den Ankunftszeiten der Gäste organisiert werden, gibt es an den Flughäfen keine Wartezeit.', 'Da unsere Prinzipien auf Gastfreundschaft basieren, sind wir bestrebt unseren Gästen so gut wie möglich behilflich zu sein.', ], },
  { id: 'institutionelle-dienstleistungen', title: 'Institutionelle Dienstleistungen', image: null, paragraphs: [ 'Aufgrund unserer jahrelangen Erfahrung, versichern wir, dass alle, durch uns erbrachten Dienste im Rahmen eines gut durchdachten Planes und Programms erstellt wurden und unsere Qualitätsstandards ständig aktualisiert und an die weltweite Konjunktur angepasst werden.', 'Für die Transportanforderungen Ihres Unternehmens können Sie, indem Sie uns Informationen über Destinationen weitergeben, günstige Preisangebote erhalten und von unseren Pauschalpreisen profitieren.', '• Organisationstransfers', '• Touristischer Transfers', '• Sportmannschaftstransfers', '• Eröffnung, Feier Transfers', '• Unternehmens- und Gewerkschaftstransfers', '• Gruppentransfers', '• Roadshow-Transfers', '• Messentransfer', '• Fahrzeugsoptionen in verschiedenen Segmenten', 'Wir bieten Lösungen in den Bereichen institutioneller Verkauf, Fahrzeugzuteilung. Jede bestätigte Reservierung, ist eine Zusage an Sie.', ], },
  { id: 'ortschaftstransfer', title: 'Ortschaftstransfer', image: null, paragraphs: [ 'Das Exclusive Austrian Transfer Team holt Sie vom Hotel, Wohnort, Adresse oder Aufenthaltsort, den Sie angegeben haben, ohne Wartezeiten ab und bringt Sie unabhängig von der Fahrstrecke unter Genuss einer hochwertigen Fahrt zum gewünschten Ankunftsort.', 'Anhand unserer Erfahrung in diesem Bereich bestimmen wir Ihre Route mit großer Sorgfalt und wählen die praktischste, sicherste und einfachste Route, um die Zeit, die sie im Verkehr verbringen werden, zu minimieren.', ], },
  { id: 'auslandtransfer', title: 'Auslandtransfer', image: null, paragraphs: [ 'Der Flughafen von Wien, eine der zentralsten Hauptstädte Europas, ist aufgrund seiner Lage der wichtigste Punkt für internationale Transfers.', 'Als Flughafen-Transferservice empfangen wir Sie, tragen Ihr Gepäck vorsichtig bis zum Fahrzeug und bringen Sie zu Ihrer gewünschten Destination wie z.B. Bratislava, Budapest, Prag, Venedig und weitere Orte innerhalb der Schengen-Ländern.', 'Gemäß unserer Unternehmensrichtlinien ist die Sicherheit unserer Kunden für uns einer der wichtigsten Faktoren.', 'Wir werden Sie bis zu Ihrer Ankunft in unseren Fahrzeugen begleiten und dank unserem Fahrzeug-Tracking-System werden Sie sich immer sicher fühlen und Ihre Reise genießen.', ], },
  { id: 'transfer-zwischen-den-bundeslaendern', title: 'Transfer Zwischen Den Bundesländern', image: null, paragraphs: [ 'Die Bundesrepublik Österreich besteht aus neun Bundesländern. Wien, Niederösterreich, Oberösterreich, Steiermark, Tirol, Kärnten, Salzburg, Vorarlberg, Burgenland.', 'In Österreich, wo Reisen zwischen den Bundesländern sehr intensiv sind, sorgen wir dafür, dass Sie nach Ihrer Landung wenn Sie kein Fahrzeug bereit haben oder öffentliche Verkehrsmittel aus zeitlichen Gründen nicht nutzen können, mit oder ohne Reservierung, sicher ihr Zielort erreichen.', ], },
];

const FLEET_VEHICLES = [
  { name: 'Mercedes-Benz E Klasse', category: 'Business Class', description: 'E 350 d AMG Line - 2015 / 2016', image: '/images/everything/fleet-e-klasse-2015.jpg', passengers: 4, luggage: 3, },
  { name: 'Mercedes-Benz V Klasse', category: 'Business Class', description: 'V 250 d extralang - 2018', image: '/images/everything/fleet-v-klasse-2018.jpeg', passengers: 7, luggage: 7, },
  { name: 'Mercedes-Benz S Klasse', category: 'First Class', description: 'S 400 d lang 4MATIC - 2020', image: '/images/everything/fleet-s-klasse-2020.jpeg', passengers: 3, luggage: 2, },
  { name: 'Mercedes-Benz E Klasse', category: 'Business Class', description: 'E 220 d AMG Line - 2017 / 2018 / 2019', image: '/images/everything/fleet-e-klasse-2017.jpeg', passengers: 4, luggage: 3, },
];

const FOOTER_LINK_GROUPS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Hauptseite', href: 'https://limosen.at/de' },
      { label: 'Unsere Fahrzeuge', href: 'https://limosen.at/de/cars' },
      { label: 'Kundenfeedback', href: '#kundenfeedback' },
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

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2663.3171060027275!2d16.598009087180113!3d48.12340777800851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476dabef40d859e9%3A0xb5eea86a2f486dc5!2sLIMOSEN%20VIP!5e0!3m2!1sen!2sat!4v1758710306571!5m2!1sen!2sat";

const GOOGLE_MAPS_OPEN =
  'https://www.google.com/maps/place/LIMOSEN+VIP/@48.1234078,16.5980091,17z/data=!4m6!3m5!1s0x476dabef40d859e9:0xb5eea86a2f486dc5!8m2!3d48.1234043!4d16.60288!16s%2Fg%2F11n0g64y7s?authuser=0&entry=tts&g_ep=EgoyMDI1MDkyMS4wIPu8ASoASAFQAw%3D%3D&skid=df28c45c-0b42-446f-90b0-1bd0e46ed3c5';

export type THamburgerMenuIconStylerProps = BoxProps

interface IHamburgerMenuIconProps {
  handleClick?: (isOpen: boolean) => void
  wrapperProps?: BoxProps
  iconProps?: BoxProps
}

const HamburgerMenuIcon: FC<IHamburgerMenuIconProps> = ({ handleClick, wrapperProps, iconProps }) => {
  const props = {
    __css: {
      '&.open': {
        '& > div:nth-of-type(1)': { top: '50%', transform: 'rotate(45deg)' },
        '& > div:nth-of-type(2)': { opacity: 0 },
        '& > div:nth-of-type(3)': { top: '50%', transform: 'rotate(-45deg)' }
      },
      '& > div': {
        transition: 'transform 0.2s cubic-bezier(0.68, 0, 0.27, 1), opacity 0.2s cubic-bezier(0.68, 0, 0.27, 1), top 0.2s cubic-bezier(0.68, 0, 0.27, 1), background-color 0.2s cubic-bezier(0.68, 0, 0.27, 1)'
      },
      ...wrapperProps?.__css
    },
    ...wrapperProps
  };

  return (
    <Box position="relative" rounded="full" boxSize="100%" onClick={handleClick} {...props}>
      <Box position="absolute" top="34%" left="25%" w="50%" h="4%" backgroundColor="topNav.mobile.hamburger.bgColor" borderRadius="full" {...iconProps} />
      <Box position="absolute" top="49%" left="25%" w="50%" h="4%" backgroundColor="topNav.mobile.hamburger.bgColor" borderRadius="full" {...iconProps} />
      <Box position="absolute" top="64%" left="25%" w="50%" h="4%" backgroundColor="topNav.mobile.hamburger.bgColor" borderRadius="full" {...iconProps} />
    </Box>
  );
}

function useServiceAccordionNavigation(serviceIds: string[]) {
  const idToIndex = useMemo(() => {
    const mapping: Record<string, number> = {};
    serviceIds.forEach((id, index) => { mapping[id] = index; });
    return mapping;
  }, [serviceIds]);

  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const pendingScrollIdRef = useRef<string | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const scrollToService = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    const el = btnRefs.current[id] ?? document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => { requestAnimationFrame(() => { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  }, []);

  const openServiceById = useCallback((targetId: string) => {
    if (!targetId || !(targetId in idToIndex)) return;
    const index = idToIndex[targetId];
    pendingScrollIdRef.current = targetId;
    setExpandedIndices([index]);
  }, [idToIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    const handleHashChange = () => { const hash = window.location.hash.replace('#', ''); openServiceById(hash); };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openServiceById]);

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    const handleNavigation = (event: Event) => {
      const anyEvent = event as CustomEvent<string>;
      const targetId = typeof anyEvent.detail === 'string' ? anyEvent.detail : '';
      if (!targetId) return;
      openServiceById(targetId);
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== targetId) window.history?.pushState?.(null, '', `#${targetId}`);
    };
    window.addEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation as EventListener);
    return () => window.removeEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation as EventListener);
  }, [openServiceById]);

  useEffect(() => {
    if (!pendingScrollIdRef.current) return;
    const targetId = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;
    scrollToService(targetId);
  }, [expandedIndices, scrollToService]);

  const handleAccordionChange = useCallback((value: number[] | number) => {
    if (Array.isArray(value)) setExpandedIndices(value);
    else if (typeof value === 'number') setExpandedIndices([value]);
    else setExpandedIndices([]);
  }, []);

  return { expandedIndices, handleAccordionChange, btnRefs };
}

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => { setSlideIndex((index) => (index + 1) % HERO_SLIDES.length); }, 6000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Box minH="100vh" bg="bg.canvas" color="text.primary" display="flex" flexDirection="column">
      <Box as="main" flex="1" display="flex" flexDirection="column" gap={0} className="homepage">
        <HeroSection background={HERO_SLIDES[slideIndex]} />
        <AboutSection />
        <FleetSection />
        <ServicesSection />
        <KundenfeedbackSection />
        <FAQSection />
        <OnlineBookingSection />
      </Box>
    </Box>
  );
}

export function HeaderBar() { /* colors to tokens */
  return (
    <Box bg="bg.headerBar" py={2} className="header-bar" display={{ base: 'none', md: 'block' }}>
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} justify="space-between" gap={{ base: 2, md: 4 }}>
          <HStack spacing={3} className="header-bar__item">
            <Icon as={FaEnvelopeOpenText} color="accent" />
            <Link href={`mailto:${CONTACT_EMAIL}`} color="text.primary">{CONTACT_EMAIL}</Link>
          </HStack>
          <HStack spacing={3} className="header-bar__item">
            <Icon as={FaWhatsapp} color="accent" />
            <Link href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`} color="text.primary">{CONTACT_PHONE}</Link>
          </HStack>
          <HStack spacing={3} ml={{ base: 0, md: 'auto' }}>
            {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
              <IconButton key={label} as={Link} href={href} aria-label={label} icon={<IconComponent />} isRound size="sm" variant="ghost" isExternal />
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

export function TopNavigation({ path }: { path?: string }) { /* structure unchanged; colors themed */
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile/mega menu
  const langModal = useDisclosure(); // language modal

  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => { if (isOpen) { setMenuActive(false); onClose(); } else { setMenuActive(true); onOpen(); } };
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) { setMenuActive(false); onClose(); } };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);
  const normalize = (p: string) => { const trimmed = p.split('#')[0].trim(); if (!trimmed) return ''; return trimmed.replace(/\/+$/, '') || '/'; };
  const currentPath = useMemo(() => normalize(path || ''), [path]);
  const linkPathname = (href: string) => { try { const u = new URL(href); return normalize(u.pathname || '/'); } catch { return normalize(href); } };

  return (
    <Box pos="relative" overflow="hidden" backgroundColor="bg.header" height={isOpen ? 'calc(100vh + 15px)' : { base: '12vh', md: '15vh' }} minH={isOpen ? '600px' : '100px'} transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)">
      <Box pos="relative" bg="bg.header" color="text.primary" transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)" height={isOpen ? 'max(600px, calc(100vh + 15px))' : '0'} minH={isOpen ? 'fit-content' : '0'} width="100%" overflow="hidden">
        <Grid as={Container} maxW="6xl" minH="max(600px, calc(100vh + 15px))" templateRows={{ base: 'auto repeat(7, 1fr)', md: 'auto repeat(3, 1fr)' }} templateColumns={{ base: '1fr', md: '1fr 1fr' }} templateAreas={{ base: '"empty" "services" "team" "portfolio" "blog" "offices" "social"', md: '"empty empty" "services team" "portfolio blog" "offices social"', }} fontSize={{ base: 'xl', md: '2xl' }} h="full" w="full" gap={0}>
          <Box gridArea="empty" h={{ base: '12vh', md: '15vh' }} minH="100px" />
          <LinkBox gridArea="services" display="flex" alignItems="center" pl={{ base: 8, md: 16 }} borderWidth="1px" borderLeft="0" borderBottom="0" borderColor="border.faint" transition="color 0.2s" _hover={{ color: 'accent' }}>
            <LinkOverlay href="#fahrzeuge">Unsere Fahrzeuge</LinkOverlay>
          </LinkBox>
          <LinkBox gridArea="team" display="flex" alignItems="center" pl={{ base: 8, md: 16 }} borderWidth="1px" borderBottom="0" borderRight="0" borderLeft={{ base: '1px', md: '0' }} borderColor="border.faint" transition="color 0.2s" _hover={{ color: 'accent' }}>
            <LinkOverlay href="#kundenfeedback">Kundenfeedback</LinkOverlay>
          </LinkBox>
          <LinkBox gridArea="portfolio" display="flex" alignItems="center" pl={{ base: 8, md: 16 }} borderWidth="1px" borderLeft="0" borderBottom="0" borderColor="border.faint" transition="color 0.2s" _hover={{ color: 'accent' }}>
            <LinkOverlay href="https://limosen.at/de/booking">Jetzt buchen</LinkOverlay>
          </LinkBox>
          <LinkBox gridArea="blog" display="flex" alignItems="center" pl={{ base: 8, md: 16 }} borderWidth="1px" borderBottom="1px" borderRight="0" borderLeft={{ base: '1px', md: '0' }} borderColor="border.faint" transition="color 0.2s" _hover={{ color: 'accent' }}>
            <LinkOverlay href="https://limosen.at/de/page/contact">Kontakt</LinkOverlay>
          </LinkBox>
          <Box gridArea="offices" pt={{ base: 8 }} pl={{ base: 8, md: 16 }} borderWidth="1px" borderTop="1px" borderBottom="0" borderLeft="0" borderRight={{ base: '1px', md: '0' }} borderColor={{ base: 'transparent', md: 'border.faint' }}>
            <Text color="text.primary" fontWeight="bold" fontSize="lg" pb={2}>Immer erreichbar</Text>
            <VStack align="flex-start" spacing={2} color="text.secondary" fontSize="md">
              <Link href={`tel:${CONTACT_PHONE_TEL}`} color="text.primary">{CONTACT_PHONE}</Link>
              <Link href={`mailto:${CONTACT_EMAIL}`} color="text.primary">{CONTACT_EMAIL}</Link>
              <Text color="text.muted">Wien, Österreich</Text>
            </VStack>
          </Box>
          <Box gridArea="social" pt={{ base: 8 }} pl={{ base: 8, md: 16 }} borderWidth="1px" borderTop="0" borderBottom="0" borderRight="0" borderLeft="0" borderColor="border.faint">
            <Text color="text.primary" fontWeight="bold" fontSize="lg" mb={3}>Folgen Sie uns</Text>
            <HStack spacing={6}>
              {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
                <Link key={label} href={href} isExternal color="text.primary" transition="color 0.2s" _hover={{ color: 'accent' }}>
                  <Icon as={IconComponent} boxSize={6} />
                </Link>
              ))}
            </HStack>
          </Box>
        </Grid>
      </Box>
      <Container maxW="6xl" pos="absolute" inset={0} pointerEvents="none">
        <Flex h={{ base: '12vh', md: '15vh' }} minH="100px" align="center" px={{ base: 4, md: 6 }} py={{ base: 2, md: 4 }} justify="space-between" pointerEvents="auto">
          <Link href="https://limosen.at" display="flex" alignItems="center" height="100%">
            <Image src={LOGO_SRC} alt="Limosen KG" height={{ base: 16, md: 20 }} objectFit="contain" />
          </Link>
          <Flex align="center" gap={{ base: 2, lg: 4 }}>
            <Flex display={{ base: 'none', lg: 'flex' }} align="center" gap={2}>
              {NAV_LINKS.map((link) => {
                const isActive = currentPath && currentPath === linkPathname(link.href);
                return (
                  <Button
                    key={link.href}
                    as={Link}
                    href={link.href}
                    variant="ghost"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                    sx={{ textDecoration: isActive ? 'underline' : 'none', textUnderlineOffset: '4px', textDecorationThickness: '2px' }}
                    _hover={{ color: 'accent', bg: 'whiteAlpha.200' }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Flex>

            {/* Language button opens Chakra UI Modal */}
            <Button
              variant="ghost"
              color="text.primary"
              px={2}
              rightIcon={<ChevronDownIcon color="text.primary" />}
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={langModal.onOpen}
            >
              <HStack spacing={2}>
                <Tooltip label="Deutsch" hasArrow>
                  <Field.Image name="flag-de" defaultValue={FLAG_DE} alt="Deutsch" style={{ width: '24px', height: '24px' }} objectFit="cover" />
                </Tooltip>
                <Text fontWeight="semibold" color="text.primary">DE</Text>
              </HStack>
            </Button>

            {/* Booking */}
            <Button as={Link} href="https://limosen.at/de/booking" size="sm" colorScheme="brand">
              Jetzt Buchen
            </Button>

            {/* Mobile menu */}
            <IconButton aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'} icon={<FaBars />} variant="ghost" onClick={toggleMenu} display={{ base: 'flex', lg: 'none' }} />
          </Flex>
        </Flex>
      </Container>

      {/* Language Modal */}
      <Modal isOpen={langModal.isOpen} onClose={langModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="bg.surface" color="text.primary">
          <ModalHeader>Sprache wählen</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" spacing={3}>
              <Button
                as={Link}
                href="https://limosen.at/de"
                justifyContent="flex-start"
                variant="ghost"
                onClick={langModal.onClose}
              >
                <HStack spacing={3}>
                  <Field.Image name="modal-flag-de" defaultValue={FLAG_DE} alt="Deutsch" style={{ width: '28px', height: '28px' }} objectFit="cover" />
                  <Text>Deutsch</Text>
                </HStack>
              </Button>
              <Button
                as={Link}
                href="https://limosen.at/en"
                justifyContent="flex-start"
                variant="ghost"
                onClick={langModal.onClose}
              >
                <HStack spacing={3}>
                  <Field.Image name="modal-flag-en" defaultValue={FLAG_EN} alt="English" style={{ width: '28px', height: '28px' }} objectFit="cover" />
                  <Text>English</Text>
                </HStack>
              </Button>
              <Button
                as={Link}
                href="https://limosen.at/tr"
                justifyContent="flex-start"
                variant="ghost"
                onClick={langModal.onClose}
              >
                <HStack spacing={3}>
                  <Field.Image name="modal-flag-tr" defaultValue={FLAG_TR} alt="Türkçe" style={{ width: '28px', height: '28px' }} objectFit="cover" />
                  <Text>Türkçe</Text>
                </HStack>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function HeroSection({ background }: { background: string }) {
  return (
    <Box as="section" className="slider-wrapper" bgImage={`url('${background}')`} bgSize="cover" bgPos="center" bgRepeat="no-repeat" minH={{ base: '320px', md: '540px' }} />
  );
}

function AboutSection() {
  return (
    <Box as="section" bg="bg.sectionAlt" py={{ base: 12, md: 20 }} className="about-us">
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 8, md: 12 }} align="stretch">
          <VStack align="flex-start" spacing={6} flex="1" className="about-text">
            <Heading size="lg" className="about-text__title">Über uns</Heading>
            <Stack spacing={4} fontSize="lg" className="about-description">
              <Text>LIMOSEN KG verfolgt seit 2016 die sektoralen und technologischen Entwicklungen und ist das ganze Jahr rund um die Uhr erreichbar.</Text>
              <Text>Unsere Flotte bestehend aus den modernsten Mercedes-Benz-Fahrzeugen mit unseren freundlichen, professionellen und erfahrenen Fahrern und einer zuverlässigen, wirtschaftlichen und komfortablen Serviceauffassung steigern wir die Servicequalität permanent und wachsen kontinuierlich weiter.</Text>
              <Text>Kundenzufriedenheit ist unsere oberste Priorität und unser Unternehmen übt die Destinationen in unserem Portfolio in bester Weise aus, um unseren Kunden die höchste Qualität zu bieten.</Text>
            </Stack>
          </VStack>

          {/* sized wrapper + fill image */}
          <Box flex={{ base: 'none', md: '0 0 40%' }} minH={{ base: '240px', md: '320px' }} borderRadius="lg" overflow="hidden">
            <Field.Image name="about-image" defaultValue={ABOUT_IMAGE} alt="Über uns" style={{ width: '100%', height: '100%' }} objectFit="cover" />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

function ServicesSection() {
  const serviceIds = useMemo(() => SERVICES_CONTENT.map((service) => service.id), []);
  const { expandedIndices, handleAccordionChange, btnRefs } = useServiceAccordionNavigation(serviceIds);

  const createContentBlocks = (paragraphs: string[]) => {
    const blocks: Array<{ type: 'text'; text: string } | { type: 'list'; items: string[] }> = [];
    let listItems: string[] = [];
    paragraphs.forEach((paragraph) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('•')) listItems.push(trimmed.replace(/^•\s*/, ''));
      else {
        if (listItems.length) { blocks.push({ type: 'list', items: listItems }); listItems = []; }
        blocks.push({ type: 'text', text: paragraph });
      }
    });
    if (listItems.length) blocks.push({ type: 'list', items: listItems });
    return blocks;
  };

  const summaryText = (paragraphs: string[]) => paragraphs.find((p) => !p.trim().startsWith('•')) || '';

  return (
    <Box as="section" bg="bg.section" py={{ base: 12, md: 20 }} id="services">
      <Container maxW="6xl">
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Unsere Services</Heading>
            <Text color="text.muted" maxW="3xl">Erhalten Sie einen schnellen Überblick über unser Angebot und vertiefen Sie sich bei Bedarf in die detaillierten Beschreibungen unserer Premium-Services.</Text>
            <Divider w={{ base: '80px', md: '120px' }} />
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {SERVICES_CONTENT.map((service) => {
              const targetHref = `#${service.id}`;
              return (
                <LinkBox
                  key={service.id}
                  id={`${service.id}-overview`}
                  bg="bg.surface"
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="border.faint"
                  boxShadow="lg"
                  role="group"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                >
                  {service.image && (
                    <AspectRatio ratio={5 / 3} w="100%">
                      <Field.Image
                        name={`service-card-${service.id}`}
                        defaultValue={service.image}
                        alt={service.title}
                        objectFit="cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </AspectRatio>
                  )}
                  <Box p={6}>
                    <LinkOverlay href={targetHref} display="block" onClick={(e) => handleServiceLinkClick(e, targetHref)}>
                      <Stack spacing={3}>
                        <Heading size="sm">{service.title}</Heading>
                        <Text color="text.secondary" fontSize="sm" noOfLines={3}>
                          {summaryText(service.paragraphs)}
                        </Text>
                        <Text fontWeight="semibold" color="accent">Mehr erfahren →</Text>
                      </Stack>
                    </LinkOverlay>
                  </Box>
                </LinkBox>
              );
            })}
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4} textAlign="center">Details zu unseren Leistungen</Heading>
            <Accordion allowMultiple reduceMotion index={expandedIndices} onChange={handleAccordionChange}>
              {SERVICES_CONTENT.map((service) => {
                const blocks = createContentBlocks(service.paragraphs);
                const hasImage = Boolean(service.image);
                return (
                  <AccordionItem key={service.id} id={service.id} border="none" mb={4}>
                    <h3>
                      <AccordionButton
                        ref={(el) => { btnRefs.current[service.id] = el; }}
                        scrollMarginTop={{ base: '120px', md: '160px' }}
                        bg="whiteAlpha.50"
                        _expanded={{ bg: 'whiteAlpha.200', borderColor: 'accent', color: 'text.primary' }}
                        borderRadius="lg"
                        px={{ base: 4, md: 6 }}
                        py={{ base: 4, md: 5 }}
                        border="1px solid"
                        borderColor="border.faint"
                      >
                        <Box flex="1" textAlign="left" fontWeight="semibold">{service.title}</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel px={{ base: 4, md: 6 }} pt={6} pb={2}>
                      <Stack spacing={6} direction={{ base: 'column', md: hasImage ? 'row' : 'column' }} align={{ base: 'stretch', md: 'flex-start' }}>
                        {hasImage && (
                          <AspectRatio ratio={5 / 3} w={{ base: '100%', md: '320px' }} flexShrink={0} borderRadius="lg" overflow="hidden">
                            <Field.Image
                              name={`service-panel-${service.id}`}
                              defaultValue={service.image as string}
                              alt={service.title}
                              objectFit="cover"
                              style={{ width: '100%', height: '100%' }}
                            />
                          </AspectRatio>
                        )}
                        <Stack spacing={4} color="text.primary" fontSize="md" flex="1">
                          {blocks.map((block, i) =>
                            (block as any).items ? (
                              <List key={i} spacing={2} pl={4} styleType="disc">
                                {(block as any).items.map((item: string, j: number) => <ListItem key={j}>{item}</ListItem>)}
                              </List>
                            ) : (
                              <Text key={i}>{(block as any).text}</Text>
                            )
                          )}
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
    <Box as="section" bg="bg.section" py={{ base: 12, md: 20 }}>
      <Container maxW="5xl">
        <VStack spacing={{ base: 8, md: 10 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Häufig gestellte Fragen</Heading>
            <Text color="text.muted" maxW="3xl">Antworten auf die wichtigsten Fragen zu Buchung, Fahrzeugen und unserem Premium-Service.</Text>
            <Divider w={{ base: '80px', md: '120px' }} />
          </VStack>
          <Accordion allowToggle reduceMotion>
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.question} border="none" mb={3}>
                <h3>
                  <AccordionButton bg="whiteAlpha.50" _expanded={{ bg: 'whiteAlpha.200', borderColor: 'accent', color: 'text.primary' }} borderRadius="lg" px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }} border="1px solid" borderColor="border.faint">
                    <Box flex="1" textAlign="left" fontWeight="semibold">{item.question}</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={{ base: 4, md: 6 }} pt={4} pb={6} color="text.primary">{item.answer}</AccordionPanel>
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
    <Box as="section" id="fahrzeuge" bg="bg.section" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <VStack spacing={10} align="stretch">
          <Heading size="lg" textAlign="center">
            Unsere Fahrzeugflotte
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 10 }}>
            {FLEET_VEHICLES.map((vehicle) => (
              <Box
                key={vehicle.image}
                bg="bg.surface"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
              >
                {/* fixed-height wrapper so the CMS image cannot collapse */}
                <Box w="100%" h={{ base: '220px', md: '260px' }} overflow="hidden">
                  <Field.Image
                    name={`fleet-${vehicle.name}`} // keep your existing Jaen field name
                    defaultValue={vehicle.image}
                    alt={vehicle.name}
                    // Force the actual img to fill the wrapper (Field.Image ignores Chakra w/h)
                    style={{ width: '100%', height: '100%' }}
                    objectFit="cover"
                  />
                </Box>

                <Stack spacing={3} p={6}>
                  <Heading size="md">{vehicle.name}</Heading>
                  <Text fontWeight="semibold" color="text.muted">
                    {vehicle.category}
                  </Text>
                  <Text color="text.secondary">{vehicle.description}</Text>

                  {/* specs row — stay inside the card */}
                  <Wrap spacing={6} pt={2}>
                    <WrapItem>
                      <HStack spacing={2}>
                        <Icon as={FaUser} color="accent" />
                        <Text color="text.secondary" fontWeight="medium">
                          Passagieranzahl: {vehicle.passengers}
                        </Text>
                      </HStack>
                    </WrapItem>
                    <WrapItem>
                      <HStack spacing={2}>
                        <Icon as={FaSuitcaseRolling} color="accent" />
                        <Text color="text.secondary" fontWeight="medium">
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
    <Box as="section" bg="bg.surfaceAlt" py={{ base: 12, md: 16 }} className="online-booking" bgImage={`url('${BOOKING_BACKGROUND}')`} bgSize="cover" bgPos="center" bgRepeat="no-repeat">
      <Container maxW="4xl">
        <VStack spacing={5} textAlign="center">
          <Heading size="md" className="online-booking__title">Buchen sie heute und lassen Sie uns den Komfort Ihrer Reise berücksichtigen.</Heading>
          <Stack spacing={3} fontSize="lg" className="online-booking__sub-title">
            <Text>Sie können uns telefonisch</Text>
            <HStack justify="center" spacing={2}>
              <Icon as={FaPhone} color="accent" />
              <Link href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(CONTACT_PHONE)}`} color="text.primary">{CONTACT_PHONE}</Link>
            </HStack>
            <Text>und</Text>
            <Text>auch mit einer E-Mail erreichen</Text>
            <HStack justify="center" spacing={2}>
              <Icon as={FaEnvelopeOpen} color="accent" />
              <Link href={`mailto:${CONTACT_EMAIL}`} color="text.primary">{CONTACT_EMAIL}</Link>
            </HStack>
          </Stack>
          <Button as={Link} href="https://limosen.at/de/page/contact" variant="outline" colorScheme="brand">Kontakt</Button>
        </VStack>
      </Container>
    </Box>
  );
}

function KundenfeedbackSection() {
  return (
    <Box as="section" id="kundenfeedback" bg="bg.section" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Kundenfeedback</Heading>
            <Text color="text.muted" maxW="3xl">Ihre aktuelle Google-Bewertung & Rezensionen sehen Sie direkt in der Karte – live von Google.</Text>
            <Divider w={{ base: '80px', md: '120px' }} />
          </VStack>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 6, md: 10 }}>
            <Box bg="bg.surface" border="1px solid" borderColor="border.faint" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="lg">
              <VStack align="flex-start" spacing={4}>
                <Heading size="md">Bewertung auf Google</Heading>
                <Text color="text.secondary">
                  Öffnen Sie LIMOSEN VIP auf Google Maps, um <strong>aktuelle Sterne</strong> und <strong>Rezensionen</strong> zu sehen oder eine Bewertung abzugeben.
                </Text>
                <HStack pt={2} spacing={3} wrap="wrap">
                  <Button as={Link} href={GOOGLE_MAPS_OPEN} isExternal colorScheme="brand">
                    Auf Google Maps ansehen
                  </Button>
                </HStack>
              </VStack>
            </Box>

            <Box bg="bg.surface" border="1px solid" borderColor="border.faint" borderRadius="xl" overflow="hidden" boxShadow="lg" minH={{ base: '280px', md: '360px' }}>
              <Box position="relative" w="100%" h="100%" minH={{ base: '280px', md: '360px' }}>
                <iframe
                  title="LIMOSEN VIP Google Maps"
                  src={GOOGLE_MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

export function Footer() {
  return (
    <Box as="footer" bg="neutral.50" py={{ base: 12, md: 16 }}>
      <Container maxW="6xl">
        <VStack spacing={{ base: 10, md: 14 }} align="stretch">
          <Flex direction={{ base: 'column', md: 'row' }} align="flex-start" gap={{ base: 8, md: 14 }}>
            <Box flexShrink={0}>
              <Image src={LOGO_SRC} alt="Limosen KG" h={{ base: 14, md: 16 }} objectFit="contain" />
              <Text mt={4} color="text.muted">Premium Chauffeur-Service in Wien und darüber hinaus.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 8, md: 10 }} flex="1">
              {FOOTER_LINK_GROUPS.map((group) => (
                <VStack key={group.title} spacing={4} align="flex-start">
                  <Text fontWeight="bold" textTransform="uppercase" letterSpacing="widest">{group.title}</Text>
                  <VStack spacing={2} align="flex-start">
                    {group.links.map((link) => (
                      <Link key={link.label} href={link.href} color="text.muted" _hover={{ color: 'text.primary' }}>
                        {link.label}
                      </Link>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </Flex>
          <Divider />
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={4}>
            <Text fontSize="sm" color="text.muted">© {new Date().getFullYear()} LIMOSEN KG. Alle Rechte vorbehalten.</Text>
            <Wrap spacing={3}>
              {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
                <WrapItem key={label}>
                  <IconButton as={Link} href={href} aria-label={label} icon={<IconComponent />} isRound size="sm" />
                </WrapItem>
              ))}
            </Wrap>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

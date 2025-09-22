import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
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
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  FLAG_SRC,
  LOGO_SRC,
  NAV_LINKS,
  SOCIAL_LINKS,
} from '../constants';

export function TopNavigation() {
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
            base: '"empty" "services" "team" "portfolio" "blog" "offices" "social"',
            md: '"empty empty" "services team" "portfolio blog" "offices social"',
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

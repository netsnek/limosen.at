import {
  Text,
  Box,
  Flex,
  Image,
  HStack,
  useDisclosure,
  IconButton,
  Grid,
  Container,
  Icon,
  Spacer,
  Button,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { FC, useState, useEffect } from 'react';
import { useContactModal } from '../../services/contact';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaGithub } from '@react-icons/all-files/fa/FaGithub';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import Netsnek from '../../gatsby-plugin-jaen/components/Netsnek';
import Logo from '../../gatsby-plugin-jaen/components/Logo';
import HamburgerMenuIcon, {
  THamburgerMenuIconStylerProps
} from '../AltHamburgerMenuIcon';
import SearchMenu from '../search-menu';
import { FadeIn } from '../FadeIn';

interface IAltTopNavProps {
  path: string;
  hamburgerIconProps?: THamburgerMenuIconStylerProps;
}

const AltTopNav: FC<IAltTopNavProps> = ({ path, hamburgerIconProps }) => {
  hamburgerIconProps = {
    color: 'red.500'
  };

  const contactModal = useContactModal();
  const handleOnContactClick = () => {
    console.log('contactModal', contactModal);
    contactModal.onOpen({
      meta: {}
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hamburgerClass, setHamburgerClass] = useState('');

  const openDrawer = () => {
    setHamburgerClass('open');
    onOpen();
  };

  const closeDrawer = () => {
    setHamburgerClass('');
    onClose();
  };

  const toggleMobileMenu = () => {
    if (hamburgerClass === 'open') closeDrawer();
    else openDrawer();
  };

  // Handle window resize and close menu if window width is >= 768px (md breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeDrawer();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      //as={FadeIn}
      pos="relative"
      overflow="hidden"
      height={isOpen ? 'calc(100vh + 15px)' : { base: '12vh', md: '15vh' }}
      minH={isOpen ? '600px' : '100px'}
      transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
      //borderBottomRadius={'2xl'}
      //backgroundColor='blackAlpha.700'
    >
      <Box
        pos="relative"
        bg="brand.900"
        color="white"
        transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
        height={isOpen ? 'max(600px, calc(100vh + 15px))' : '0'}
        minH={isOpen ? 'fit-content' : '0'}
        width="100%"
        overflow="hidden"
      >
        <Grid
          as={Container}
          maxW="8xl"
          minH="max(600px, calc(100vh + 15px))"
          templateRows={{
            base: 'auto repeat(7, 1fr)',
            md: 'auto repeat(3, 1fr)'
          }} // Set the first row height to 15vh
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          templateAreas={{
            base: `"empty" "services" "team" "portfolio" "blog" "offices" "social"`,
            md: `"empty empty"
                         "services team"
                         "portfolio blog"
                         "offices social"`
          }}
          //gap={4}
          fontSize={{ base: 'xx-large', md: 'xxx-large' }}
          h="full"
          w="full"
        >
          <Box
            gridArea="empty"
            h={{ base: '12vh', md: '15vh' }}
            minH={{ base: '100px', md: '100px' }}
          />
          <LinkBox
            gridArea="services"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderRight="1px"
            borderLeft="0"
            borderBottom="0"
            borderColor={useColorModeValue('brand.800', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/#change-coaching">Coaching</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="team"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderBottom="0"
            borderRight="0"
            borderLeft={{ base: '1px', md: '0px' }}
            borderColor={useColorModeValue('brand.800', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/#psychotherapie">Psychotherapie</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="portfolio"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderRight="1px"
            borderLeft="0"
            borderBottom="0"
            borderColor={useColorModeValue('brand.800', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/#preise">Preise</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="blog"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderBottom="1px"
            borderRight="0"
            borderLeft={{ base: '1px', md: '0px' }}
            borderColor={useColorModeValue('brand.800', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/docs/">Blog</LinkOverlay>
          </LinkBox>
          <Box
            gridArea="offices"
            pt={{ base: '8' }}
            pl={{ base: '8', md: '16' }}
            borderWidth="1px"
            borderTop="1px"
            borderBottom="0"
            borderRight={{ base: '1px', md: '0px' }}
            borderLeft="0"
            borderStyle="solid"
            borderColor={{ base: 'transparent', md: useColorModeValue('brand.800', 'gray.600') }}
          >
            {/* Office information here */}
            <Text color="white" fontWeight="bold" fontSize="lg" pb="4">
              Im Herzen von Wien
            </Text>
            {/* <Text color="white" fontSize="md">
              Hauptquartier
            </Text> */}
            <Text color="gray.400" fontSize="md">
              Löwengasse 28/22
            </Text>
            <Text color="gray.400" fontSize="md">
              1030 Wien, Österreich
            </Text>
          </Box>
          <Box
            gridArea="social"
            pt={{ base: '8' }}
            pl={{ base: '8', md: '16' }}
            borderWidth="1px"
            borderTop="0"
            borderBottom="0"
            borderRight="0"
            borderLeft="0"
            borderStyle="solid"
            borderColor={useColorModeValue('brand.800', 'gray.600')}
          >
            {/* Social media links here */}
            <Text color="white" fontWeight="bold" fontSize="lg">
              Folge mir auf
            </Text>
            <HStack spacing="8">
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://www.facebook.com/profile.php?id=61552973278627" isExternal>
                  <Icon as={FaFacebook} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://instagram.com/barbara.mauz" isExternal>
                  <Icon as={FaInstagram} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              {/* <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://twitter.com/netsnek_com" isExternal>
                  <Icon as={FaTwitter} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://github.com/netsnek" isExternal>
                  <Icon as={FaGithub} boxSize="6" />
                </LinkOverlay>
              </LinkBox> */}
            </HStack>
          </Box>
        </Grid>
      </Box>
      {/* The rest of your AltTopNav and navigation components */}
      <Box pos="absolute" top="0" left="0" w="100%">
        <Container maxW="8xl" pointerEvents="auto">
          <HStack
            h={{ base: '12vh', md: '15vh' }}
            minH="100px"
            alignItems={'center'}
            px={{ base: '4', md: '8' }}
            py={{ base: '2', md: '4' }}
            justifyContent="space-between"
          >
            <LinkBox height="100%" flex="2" mr="4" display="flex">
              <LinkOverlay href="/" color="white">
                {/* <Logo height="100%" color="#9d1bb0" /> */}
                <Logo height="100%" />
                {/* <Image height="100%" src="/content/nadinefontlogo2.png" /> */}
                {/* <Text py="5" fontSize="4xl" fontWeight="bold" color="#9d1bb0">
                  Nadine Hauswirth
                </Text> */}
              </LinkOverlay>
            </LinkBox>
            <Flex alignItems="center" flex="1" justifyContent="flex-end">
              {/* <Button
                variant="ghost"
                ml={1}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                onClick={() => {
                  // if not on the homepage, redirect to the homepage first
                  if (path !== '/docs') {
                    window.location.href = '/docs';
                  }

                  // const element = document.getElementById('meine_kunden');
                  // if (element) {
                  //   element.scrollIntoView({ behavior: 'smooth' });
                  // }
                }}
                fontSize="sm"
                fontWeight="semibold"
                color="#273E53"
                display={{ base: 'none', lg: 'block' }}
              >
                Über mich
              </Button>
              <Button
                variant="ghost"
                ml={1}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                onClick={() => {
                  // if not on the homepage, redirect to the homepage first
                  if (path !== '/') {
                    window.location.href = '/';
                  }

                  const element = document.getElementById('meine_beratung');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                fontSize="sm"
                fontWeight="semibold"
                color="#273E53"
                display={{ base: 'none', lg: 'block' }}
              >
                Kurse & Webinare
              </Button>
              <Button
                variant="ghost"
                ml={1}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                onClick={() => window.location.href = '/recipes'}
                fontSize="sm"
                fontWeight="semibold"
                color="#273E53"
                display={{ base: 'none', lg: 'block' }}
              >
                Rezepte
              </Button>
              <Button
                variant="ghost"
                ml={1}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                onClick={() => window.location.href = '/docs'}
                fontSize="sm"
                fontWeight="semibold"
                color="#273E53"
                display={{ base: 'none', lg: 'block' }}
              >
                Blog
              </Button> */}
              <SearchMenu
                display={{ base: 'block', lg: 'block' }}
                ml={4}
                boxSizing={'border-box'}
                borderWidth={{ base: 0, lg: 2 }}
                borderColor='#7f188c'
                color={{ base: '#7f188c', md: '#7f188c' }}
                fontWeight={'semibold'}
                opacity="0.7"
                _hover={{
                  opacity: "1",
                  borderColor: 'brand.500',
                  bg: { base: 'brand.500', md: 'transparent' }
                }}
              />
              <Button
                ml={2}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                onClick={handleOnContactClick}
                fontSize="sm"
                fontWeight="semibold"
                bg="#7f188c"
                color="white"
                display={{ base: 'none', lg: 'block' }}
              >
                Kontakt
              </Button>
              {/* <Button
                  ml={4}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  onClick={handleOnContactClick}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="white"
                  display={{base: 'none', md: 'block'}}>
                  Login
                </Button> */}
              <IconButton
                variant="ghost"
                // display={{ base: 'block', lg: 'none' }}
                ml={4}
                icon={
                  <HamburgerMenuIcon
                    handleClick={toggleMobileMenu}
                    wrapperProps={{ className: hamburgerClass }}
                    iconProps={{
                      // ...hamburgerIconProps,
                      //boxSize: '6',
                      //boxSize: '100%',
                      backgroundColor: isOpen ? 'white' : '#7f188c'
                    }}
                  />
                }
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                //variant="ghost"
                fontWeight={'bold'}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMobileMenu}
              />
            </Flex>
          </HStack>
        </Container>
      </Box>
      <Box
        pointerEvents="none"
        pos="absolute"
        top="0"
        left="0"
        transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
        h={isOpen ? 'max(600px, 100vh)' : '0'} // Adjust according to your AltTopNav's initial height
        w="100%"
        overflow="hidden"
      >
        <Container maxW="8xl" pointerEvents="auto">
          <HStack
            h={{ base: '12vh', md: '15vh' }}
            minH="100px"
            alignItems={'center'}
            px={{ base: '4', md: '8' }}
            py={{ base: '2', md: '4' }}
            justifyContent="space-between"
          >
            <LinkBox height="100%" flex="2" mr="4" display="flex">
              <LinkOverlay href="/" color="white">
                <Logo height="100%" color="white" />
                {/* <Image height="100%" src="/content/nadinefontlogo2.png" filter={"invert(1)"} /> */}
                {/* <Text py="5" fontSize="4xl" fontWeight="bold" color="#ffffff">
                  Nadine Hauswirth
                </Text> */}
              </LinkOverlay>
            </LinkBox>
            <Flex alignItems="center" flex="1" justifyContent="flex-end">
              <SearchMenu
                borderColor={'white'}
                boxSizing={'border-box'}
                borderWidth={{ base: 0, lg: 2 }}
                bg={{ base: 'white', lg: 'transparent' }}
                color={{ base: 'black', lg: 'gray.400' }}
                _hover={{
                  borderColor: 'brand.500',
                  bg: { base: 'white', md: 'transparent' }
                }}
                ml={4}
              />
              <Button
                ml={2}
                _hover={{
                  bg: 'brand.500'
                }}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                //variant="ghost"
                onClick={handleOnContactClick}
                fontSize="sm"
                fontWeight="semibold"
                bg="white"
                color="black"
                display={{ base: 'none', md: 'block' }}
              >
                Kontakt
              </Button>
              {/* <Button
                  ml={4}
                  _hover={{
                    bg: 'brand.500'
                  }}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  //variant="ghost"
                  onClick={handleOnContactClick}
                  fontSize="sm"
                  fontWeight="semibold"
                  bg="white"
                  color="black"
                  display={{base: 'none', md: 'block'}}>
                  Login
                </Button> */}
              <IconButton
                variant="ghost"
                // display={{ base: 'block', lg: 'none' }}
                ml={4}
                _hover={{
                  bg: 'brand.500'
                }}
                icon={
                  <HamburgerMenuIcon
                    // handleClick={toggleMobileMenu}
                    wrapperProps={{ className: hamburgerClass }}
                    iconProps={{
                      // ...hamburgerIconProps,
                      //boxSize: '6',
                      //boxSize: '100%',
                      backgroundColor: isOpen ? 'white' : 'brand.700'
                    }}
                  />
                }
                //filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"

                //variant="ghost"
                fontWeight={'bold'}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMobileMenu}
                bg={'brand.900'}
                color={'black'}
              />
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default AltTopNav;

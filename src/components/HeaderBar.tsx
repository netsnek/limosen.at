import { Box, Container, Flex, HStack, Icon, IconButton, Link } from '@chakra-ui/react';
import { FaEnvelopeOpenText, FaWhatsapp } from 'react-icons/fa';
import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from '../constants';

export function HeaderBar() {
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

import {
  Box,
  Container,
  Divider,
  Flex,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FOOTER_LINK_GROUPS, LOGO_SRC, SOCIAL_LINKS } from '../constants';

export function Footer() {
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

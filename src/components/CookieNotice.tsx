import { Box, Button, Container, Flex, HStack, Link, Text } from '@chakra-ui/react';

type CookieNoticeProps = {
  onAccept: () => void;
};

export function CookieNotice({ onAccept }: CookieNoticeProps) {
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

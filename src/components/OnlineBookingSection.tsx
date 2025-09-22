import { Box, Button, Container, Heading, HStack, Icon, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { FaEnvelopeOpen, FaPhone } from 'react-icons/fa';
import { BOOKING_BACKGROUND, CONTACT_EMAIL, CONTACT_PHONE } from '../constants';

export function OnlineBookingSection() {
  return (
    <Box
      as="section"
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

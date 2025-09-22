import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaSuitcaseRolling, FaUser } from 'react-icons/fa';
import { FLEET_VEHICLES } from '../constants';

export function FleetSection() {
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

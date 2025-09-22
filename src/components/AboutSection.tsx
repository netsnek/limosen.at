import { Box, Container, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { ABOUT_IMAGE } from '../constants';

export function AboutSection() {
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
                LIMOSEN KG verfolgt seit 2016 die sektoralen und technologischen Entwicklungen und ist das ganze Jahr rund um
                die Uhr erreichbar.
              </Text>
              <Text>
                Unsere Flotte bestehend aus den modernsten Mercedes-Benz-Fahrzeugen mit unseren freundlichen, professionellen
                und erfahrenen Fahrern und einer zuverlässigen, wirtschaftlichen und komfortablen Serviceauffassung steigern wir
                die Servicequalität permanent und wachsen kontinuierlich weiter.
              </Text>
              <Text>
                Kundenzufriedenheit ist unsere oberste Priorität und unser Unternehmen übt die Destinationen in unserem Portfolio
                in bester Weise aus, um unseren Kunden die höchste Qualität zu bieten.
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

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Divider,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FAQ_ITEMS } from '../constants';

export function FAQSection() {
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
                <AccordionPanel px={{ base: 4, md: 6 }} pt={{ base: 4, md: 4 }} pb={{ base: 6, md: 6 }} color="whiteAlpha.900">
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

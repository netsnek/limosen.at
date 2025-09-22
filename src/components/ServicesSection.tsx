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
  Image,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { SERVICES_CONTENT } from '../constants';
import { handleServiceLinkClick } from '../utils/serviceNavigation';
import { useServiceAccordionNavigation } from '../hooks/useServiceAccordionNavigation';

type ServiceContentBlock =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'list';
      items: string[];
    };

export function ServicesSection() {
  const serviceIds = useMemo(() => SERVICES_CONTENT.map((service) => service.id), []);
  const { expandedIndices, handleAccordionChange } = useServiceAccordionNavigation(serviceIds);

  const createContentBlocks = (paragraphs: string[]): ServiceContentBlock[] => {
    const blocks: ServiceContentBlock[] = [];
    let listItems: string[] = [];

    paragraphs.forEach((paragraph) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('•')) {
        listItems.push(trimmed.replace(/^•\s*/, ''));
      } else {
        if (listItems.length) {
          blocks.push({ type: 'list', items: listItems });
          listItems = [];
        }
        blocks.push({ type: 'text', text: paragraph });
      }
    });

    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems });
    }

    return blocks;
  };

  const summaryText = (paragraphs: string[]) => {
    const firstParagraph = paragraphs.find((paragraph) => !paragraph.trim().startsWith('•'));
    return firstParagraph || '';
  };

  return (
    <Box as="section" bg="#1b1b1b" py={{ base: 12, md: 20 }} id="services">
      <Container maxW="6xl">
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="lg">Unsere Services</Heading>
            <Text color="whiteAlpha.700" maxW="3xl">
              Erhalten Sie einen schnellen Überblick über unser Angebot und vertiefen Sie sich bei Bedarf in die
              detaillierten Beschreibungen unserer Premium-Services.
            </Text>
            <Divider borderColor="whiteAlpha.300" w={{ base: '80px', md: '120px' }} />
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {SERVICES_CONTENT.map((service) => {
              const targetHref = `#${service.id}`;

              return (
                <LinkBox
                  key={service.id}
                  id={`${service.id}-overview`}
                  bg="#252525"
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  boxShadow="lg"
                  role="group"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                >
                  {service.image && (
                    <Box h="160px" overflow="hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        w="full"
                        h="full"
                        objectFit="cover"
                        transform="scale(1)"
                        transition="transform 0.4s"
                        _groupHover={{ transform: 'scale(1.05)' }}
                      />
                    </Box>
                  )}
                  <Box p={6}>
                    <LinkOverlay
                      href={targetHref}
                      display="block"
                      onClick={(event) => handleServiceLinkClick(event, targetHref)}
                    >
                      <Stack spacing={3}>
                        <Heading size="sm">{service.title}</Heading>
                        <Text color="whiteAlpha.800" fontSize="sm" noOfLines={3}>
                          {summaryText(service.paragraphs)}
                        </Text>
                        <Text fontWeight="semibold" color="#bb4338">
                          Mehr erfahren →
                        </Text>
                      </Stack>
                    </LinkOverlay>
                  </Box>
                </LinkBox>
              );
            })}
          </SimpleGrid>

          <Box>
            <Heading size="md" mb={4} textAlign="center">
              Details zu unseren Leistungen
            </Heading>
            <Accordion allowMultiple reduceMotion index={expandedIndices} onChange={handleAccordionChange}>
              {SERVICES_CONTENT.map((service) => {
                const blocks = createContentBlocks(service.paragraphs);
                const hasImage = Boolean(service.image);

                return (
                  <AccordionItem
                    key={service.id}
                    id={service.id}
                    border="none"
                    mb={4}
                    scrollMarginTop={{ base: '120px', md: '160px' }}
                  >
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
                          {service.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel px={{ base: 4, md: 6 }} pt={6} pb={2}>
                      <Stack
                        spacing={6}
                        direction={{ base: 'column', md: hasImage ? 'row' : 'column' }}
                        align={{ base: 'stretch', md: 'flex-start' }}
                      >
                        {hasImage && (
                          <Image
                            src={service.image ?? undefined}
                            alt={service.title}
                            borderRadius="lg"
                            maxW={{ base: '100%', md: '320px' }}
                            objectFit="cover"
                            boxShadow="lg"
                          />
                        )}
                        <Stack spacing={4} color="whiteAlpha.900" fontSize="md" flex="1">
                          {blocks.map((block, blockIndex) => {
                            if (block.type === 'list') {
                              return (
                                <List key={`${service.id}-list-${blockIndex}`} spacing={2} pl={4} styleType="disc">
                                  {block.items.map((item, itemIndex) => (
                                    <ListItem key={`${service.id}-list-${blockIndex}-item-${itemIndex}`}>
                                      {item}
                                    </ListItem>
                                  ))}
                                </List>
                              );
                            }
                            return <Text key={`${service.id}-text-${blockIndex}`}>{block.text}</Text>;
                          })}
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

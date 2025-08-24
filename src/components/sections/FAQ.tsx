// components/sections/FAQ.tsx
import { FC, ReactNode, useMemo } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  chakra
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const BRAND = {
  base: '#18011a',
  accent: '#7f188c',
  white: '#ffffff'
}

// same subtle tag glow as in ChangeCoaching
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`

export interface FAQProps {
  id?: string
  accentColor?: string
  title?: string
}

type QA = { q: string; a: ReactNode }

const FAQ: FC<FAQProps> = ({
  id = 'faq',
  accentColor,
  title = 'Häufige Fragen (FAQ)'
}) => {
  const ACCENT = accentColor ?? BRAND.accent
  const headingFont =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"

  // keep answers short, clear, ich-Form, and aligned with your site’s copy
  const items: QA[] = useMemo(
    () => [
      {
        q: 'Worin liegt der Unterschied zwischen Coaching und Psychotherapie?',
        a: (
          <>
            <Text mb={3}>
              <strong>Coaching</strong> richtet sich an nicht-krankhafte Anliegen:
              Leistung, Fokus, Entscheidungen, Rollenwechsel, Umgang mit Technik
              (z. B. KI-Leistungsdruck) oder Work-/Tech-Life-Balance. Ziel ist
              Klarheit, Ergebnisfokus und Verhaltenstraining im Alltag.
            </Text>
            <Text>
              <strong>Psychotherapie</strong> setze ich ein, wenn Symptome
              <em> Krankheitswert</em> haben (z. B. Ängste, Depression,
              Zwangssymptome, psychosomatische Beschwerden, anhaltende Krisen).
              Hier arbeite ich tiefenpsychologisch fundiert an unbewussten
              Dynamiken, Beziehungsmustern und einer nachhaltigen Erweiterung
              deines Handlungsspielraums.
            </Text>
          </>
        )
      },
      {
        q: 'Wann empfehle ich Coaching – und wann Psychotherapie?',
        a: (
          <>
            <Text mb={2}>
              <strong>Coaching</strong>: Du bist grundsätzlich psychisch stabil,
              möchtest aber schneller, strukturiert und gezielt an Zielen arbeiten
              – z. B. mit KI-Tools souverän umgehen, Impostor-Gefühle einordnen oder
              digitale Routinen (Digital Detox) etablieren.
            </Text>
            <Text>
              <strong>Psychotherapie</strong>: Wenn dich Symptome deutlich
              einschränken (Schlaf, Appetit, Stimmung, Ängste, Zwänge,
              psychosomatische Beschwerden) oder Konflikte immer wiederkehren.
              Ich kläre das mit dir im Erstgespräch und empfehle den passenden
              Rahmen.
            </Text>
          </>
        )
      },
      {
        q: 'Wie oft finden die Sitzungen statt?',
        a: (
          <>
            <Text mb={2}>
              <strong>Coaching</strong>: flexibel – meist alle 1–3 Wochen, je nach
              Ziel und Tempo.
            </Text>
            <Text>
              <strong>Psychotherapie</strong>: in der Regel 1–2× pro Woche (bei
              Psychoanalyse auch häufiger). Kontinuität ist hier Teil der
              Wirksamkeit.
            </Text>
          </>
        )
      },
      {
        q: 'Gilt die Schweigepflicht auch im Coaching?',
        a: (
          <Text>
            Ja. <strong>Schweigepflicht</strong> ist für mich Standard – in der
            <em> Psychotherapie ebenso wie im Coaching</em>. Diese Vertraulichkeit
            schafft den sicheren Rahmen, der mich von vielen Coaches abhebt: Du
            kannst offen sprechen, ohne dass Inhalte nach außen gelangen.
          </Text>
        )
      },
      {
        q: 'Einzel oder Gruppe – was biete ich an?',
        a: (
          <Text>
            Ich arbeite im <strong>Einzel-Setting</strong> und biete auch{' '}
            <strong>Gruppen</strong> an. Für bestimmte Themen (z. B. Prokrastination
            oder Digital Detox) kann Gruppe sehr wirksam sein.
          </Text>
        )
      },
      {
        q: 'Was passiert im kostenlosen Erstgespräch?',
        a: (
          <Text>
            Wir klären dein Anliegen, Ziele und ob <em>Coaching</em> oder{' '}
            <em>Psychotherapie</em> sinnvoll ist. Du erhältst eine Empfehlung zum
            Rahmen (Frequenz, Vorgehen) – transparent und ohne Verpflichtung.
          </Text>
        )
      }
    ],
    []
  )

  return (
    <Box as="section" id={id} bg="white" color="black" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        {/* Tag im ChangeCoaching-Stil */}
        <Tag
          size="lg"
          borderRadius="full"
          px={4}
          py={2}
          bg={`${ACCENT}1A`}
          color={ACCENT}
          fontWeight="800"
          letterSpacing="0.06em"
          textTransform="uppercase"
          border="1px solid"
          borderColor={`${ACCENT}66`}
          animation={`${glow} 2.2s ease-in-out infinite alternate`}
        >
          FAQ
        </Tag>

        <Heading
          as="h2"
          mt={4}
          fontFamily={headingFont}
          fontSize={{ base: '2xl', md: '3xl' }}
          lineHeight="1.2"
          fontWeight="900"
        >
          {title}
          <chakra.span color={ACCENT}>.</chakra.span>
        </Heading>

        <VStack spacing={4} mt={{ base: 6, md: 8 }} align="stretch">
          <Accordion allowToggle reduceMotion>
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="2xl"
                boxShadow="0 12px 40px rgba(0,0,0,0.12)"
                overflow="hidden"
                // remove Chakra's default border between items
                _notLast={{ mb: 4 }}
              >
                <h3>
                  <AccordionButton
                    px={{ base: 4, md: 6 }}
                    py={{ base: 4, md: 5 }}
                    _hover={{ bg: 'blackAlpha.50' }}
                    _expanded={{
                      bg: 'blackAlpha.50',
                      color: 'black'
                    }}
                    position="relative"
                  >
                    {/* small accent bar on the left, matching your style */}
                    <Box
                      position="absolute"
                      left={0}
                      top={0}
                      bottom={0}
                      w="4px"
                      bg={ACCENT}
                      opacity={0.85}
                    />
                    <Box as="span" flex="1" textAlign="left" fontWeight="800">
                      {item.q}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={{ base: 4, md: 6 }} pb={{ base: 5, md: 6 }}>
                  {item.a}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          {/* kleiner Hinweis zur Orientierung */}
          <Text fontSize="sm" color="blackAlpha.700" mt={2}>
            Hinweis: Coaching ist <em>keine</em> Psychotherapie und ersetzt bei
            krankheitswertigen Symptomen keine Behandlung. Im Zweifel kläre ich im
            Erstgespräch mit dir, welcher Rahmen passt.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default FAQ

// AchivementCounter.tsx
import { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  chakra,
  Tag,
  usePrefersReducedMotion
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Field } from 'jaen';

// -----------------------------
// Shared brand (override via props)
// -----------------------------
export type CounterItem = { label: string; value: number; suffix?: string };

export interface AchivementCounterProps {
  items: CounterItem[];
  title?: string;
  tagText?: string;
  durationMs?: number;
  id?: string;
  brand?: { base: string; accent: string; white: string };
}

const BRAND_FALLBACK = { base: '#18011a', accent: '#7f188c', white: '#ffffff' };

// -----------------------------
// Animations (same feel as ChangeCoaching)
// -----------------------------
const shimmerLR = keyframes`
  0%   { background-position:   0% 0; }
  100% { background-position: 200% 0; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`;

// -----------------------------
// Number logic (unchanged)
// -----------------------------
const AnimatedNumber: FC<{
  value: number;
  start: boolean;
  duration?: number;
}> = ({ value, start, duration = 1400 }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<number>(
    prefersReducedMotion || start ? value : 0
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    if (!start) return;

    let t0: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3); // schnell → langsamer

    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / duration);
      setDisplay(Math.round(value * easeOutCubic(p)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, value, duration, prefersReducedMotion]);

  return <>{display.toLocaleString('de-AT')}</>;
};

// Beam-Fenster synchron zur Count-Dauer
const useCountingWindow = (
  start: boolean,
  duration: number,
  prefersReducedMotion: boolean
) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion || !start) {
      setActive(false);
      return;
    }
    setActive(true);
    const id = setTimeout(() => setActive(false), duration);
    return () => clearTimeout(id);
  }, [start, duration, prefersReducedMotion]);
  return active;
};

// Vollflächiger violetter Balken + L→R Shimmer
const ChargeBar: FC<{
  active: boolean;
  accent: string;
  height?: string | number;
}> = ({ active, accent, height = '6px' }) => (
  <Box
    mt={4}
    position="relative"
    h={height}
    borderRadius="full"
    overflow="hidden"
    bg={accent}
  >
    {/* dezenter Gloss */}
    <Box
      position="absolute"
      inset={0}
      pointerEvents="none"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bgGradient:
          'linear(to-b, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.10) 65%, rgba(0,0,0,0.18))',
        opacity: 0.35
      }}
    />
    {/* L→R Shimmer */}
    <Box
      position="absolute"
      inset={0}
      opacity={active ? 1 : 0}
      bg={`linear-gradient(
        90deg,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.18) 20%,
        rgba(255,255,255,0.40) 35%,
        rgba(255,255,255,0.18) 50%,
        rgba(255,255,255,0) 65%,
        rgba(255,255,255,0) 100%
      )`}
      backgroundSize="200% 100%"
      animation={active ? `${shimmerLR} 1100ms linear infinite` : 'none'}
      willChange="background-position"
      mixBlendMode="screen"
    />
  </Box>
);

// Eine Karte – exakt wie das Bild in ChangeCoaching gestylt
const CounterCard: FC<{
  item: CounterItem;
  start: boolean;
  durationMs: number;
  accent: string;
}> = ({ item, start, durationMs, accent }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const active = useCountingWindow(start, durationMs, prefersReducedMotion);
  const showSuffix = prefersReducedMotion ? true : start && !active;

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="blackAlpha.200"
      boxShadow="0 12px 40px rgba(0,0,0,0.12)"
      bg="white"
      p={{ base: 5, md: 6 }}
    >
      {/* identische Akzent-Überblendung wie im ChangeCoaching-Bild */}
      <Box
        position="absolute"
        inset={0}
        // bgGradient={`linear(to-tr, transparent 60%, ${accent}33 100%)`}
        pointerEvents="none"
      />

      <Stat position="relative" zIndex={1}>
        <StatLabel
          fontSize={{ base: 'sm', md: 'md' }}
          textTransform="uppercase"
          letterSpacing="0.08em"
          color="blackAlpha.700"
          mb="1"
        >
          {item.label}
        </StatLabel>
        <StatNumber
          aria-live="polite"
          fontWeight="900"
          lineHeight="1"
          color="black"
          fontSize={{ base: '4xl', md: '5xl' }}
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <AnimatedNumber
            value={item.value}
            start={start}
            duration={durationMs}
          />
          {item.suffix ? (
            <chakra.span
              ml="1"
              display="inline-block"
              opacity={showSuffix ? 1 : 0}
              transform={showSuffix ? 'translateY(0)' : 'translateY(-0.25em)'}
              transition="opacity 300ms ease, transform 300ms ease"
              aria-hidden={!showSuffix}
            >
              {item.suffix}
            </chakra.span>
          ) : null}
        </StatNumber>
      </Stat>

      <ChargeBar active={active} accent={accent} />
    </Box>
  );
};

// -----------------------------
// Haupt-Component
// -----------------------------
const AchivementCounter: FC<AchivementCounterProps> = ({
  items,
  tagText = 'Erfahrung & Wirkung',
  durationMs = 1400,
  id = 'achievement-counter',
  brand
}) => {
  const BRAND = brand ?? BRAND_FALLBACK;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);
  const hasStartedRef = useRef(false);
  const headingFont =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true; // nur 1x
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Container
      id={id}
      ref={containerRef}
      maxW="7xl"
      // Spacing wie in ChangeCoaching
      py={{ base: 10, md: 16 }}
      // Container selbst ohne Border/Shadow – wie die Section in ChangeCoaching
      bg="white"
      color="black"
    >
      {/* Tag – wie in ChangeCoaching */}
      <Tag
        size="lg"
        borderRadius="full"
        px={4}
        py={2}
        bg={`${BRAND.accent}1A`} // ~10% Opazität
        color={BRAND.accent}
        fontWeight="800"
        letterSpacing="0.06em"
        textTransform="uppercase"
        border="1px solid"
        borderColor={`${BRAND.accent}66`}
        animation={`${glow} 2.2s ease-in-out infinite alternate`}
      >
        <Field.Text
          as={chakra.span}
          name="AchivementCounterTag"
          defaultValue="Change Coaching"
        />
      </Tag>
      {/* Headline – gleiche Typo/Spacing wie in ChangeCoaching */}
      <Heading
        as="h2"
        mt={4}
        fontFamily={headingFont}
        fontSize={{ base: '2xl', md: '3xl' }}
        lineHeight="1.2"
        fontWeight="900"
      >
        <Field.Text
          as={chakra.span}
          name="AchivementCounterHeadline"
          defaultValue="Langjährige Erfahrung mit Therapie und Coaching"
        />
        <chakra.span color={BRAND.accent}>.</chakra.span>
      </Heading>
      <SimpleGrid
        mt={{ base: 8, md: 12 }}
        columns={{ base: 1, sm: 3 }}
        spacing={{ base: 8, md: 12 }}
      >
        {items.map(it => (
          <CounterCard
            key={it.label}
            item={it}
            start={start}
            durationMs={durationMs}
            accent={BRAND.accent}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default AchivementCounter;

import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { HERO_SLIDES } from './constants';
import { HeaderBar } from './components/HeaderBar';
import { TopNavigation } from './components/TopNavigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FleetSection } from './components/FleetSection';
import { ServicesSection } from './components/ServicesSection';
import { FAQSection } from './components/FAQSection';
import { OnlineBookingSection } from './components/OnlineBookingSection';
import { Footer } from './components/Footer';
import { CookieNotice } from './components/CookieNotice';

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showCookies, setShowCookies] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Box minH="100vh" bg="#424242" color="whiteAlpha.900" display="flex" flexDirection="column">
      <Box as="header" className="main-wrapper">
        <HeaderBar />
        <TopNavigation />
      </Box>

      <Box as="main" flex="1" display="flex" flexDirection="column" gap={0} className="homepage">
        <HeroSection background={HERO_SLIDES[slideIndex]} />
        <AboutSection />
        <FleetSection />
        <ServicesSection />
        <FAQSection />
        <OnlineBookingSection />
      </Box>

      <Footer />

      {showCookies && <CookieNotice onAccept={() => setShowCookies(false)} />}
    </Box>
  );
}

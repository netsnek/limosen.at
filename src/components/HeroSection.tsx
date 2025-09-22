import { Box } from '@chakra-ui/react';

type HeroSectionProps = {
  background: string;
};

export function HeroSection({ background }: HeroSectionProps) {
  return (
    <Box
      as="section"
      className="slider-wrapper"
      bgImage={`url('${background}')`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      minH={{ base: '320px', md: '540px' }}
    />
  );
}

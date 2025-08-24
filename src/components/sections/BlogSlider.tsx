// components/sections/BlogSlider.tsx
import React, {FC, useEffect, useMemo, useState} from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Tag,
  Button,
  Skeleton,
  chakra,
  Link as ChakraLink
} from '@chakra-ui/react'
import {keyframes} from '@emotion/react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import {ProductCard} from '../ProductCard' // reusing your existing card
import {usePage} from 'jaen'
import {useJaenBlogs} from '../../hooks/use-blog-pages' // <-- the hook we created
import { BlogCard } from '../BlogCard'

const BRAND = {accent: '#7f188c'}
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`

export interface BlogSliderProps {
  /** pass the result of useJaenPageIndex({ jaenPageId: 'JaenPage /blog/' }) */
  blogIndex: any
  id?: string
  title?: string
  accentColor?: string
  /** if true, only show featured posts (first 4) */
  featuredOnly?: boolean
}

const BlogSlider: FC<BlogSliderProps> = ({
  blogIndex,
  id = 'blog-slider',
  title = 'Neues aus dem Blog',
  accentColor,
  featuredOnly = false
}) => {
  const ACCENT = accentColor ?? BRAND.accent
  const headingFont =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"

  // pull CMS media for resolving media node ids
  const cmsMediaPage = usePage({id: 'JaenPage /cms/media/', injectMedia: true})

  // 🔌 use Jaen → to ProductCard-compatible blog items
  const {posts, featuredPosts} = useJaenBlogs(blogIndex, cmsMediaPage, {
    limit: 12 // adjust if you want more items in the slider
  })

  // choose data source for the slider
  const items = featuredOnly ? featuredPosts : posts

  const [loading, setLoading] = useState(true)
  useEffect(() => setLoading(false), [])

  // react-slick settings
  const slidesToShowBase = 4
  const settings = useMemo(
    () => ({
      dots: true,
      arrows: true,
      infinite: (items?.length || 0) > slidesToShowBase,
      speed: 500,
      slidesToShow: slidesToShowBase,
      slidesToScroll: 1,
      adaptiveHeight: true,
      responsive: [
        {breakpoint: 1024, settings: {slidesToShow: 4}},
        {breakpoint: 900, settings: {slidesToShow: 3}},
        {breakpoint: 640, settings: {slidesToShow: 1}}
      ],
      nextArrow: <Arrow dir="right" />,
      prevArrow: <Arrow dir="left" />
    }),
    [items?.length]
  )

  return (
    <Box as="section" id={id} bg="white" color="black" py={{base: 10, md: 16}}>
      <Container maxW="7xl">
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
          Blog
        </Tag>

        <Heading
          as="h2"
          mt={4}
          fontFamily={headingFont}
          fontSize={{base: '2xl', md: '3xl'}}
          lineHeight="1.2"
          fontWeight="900"
        >
          {title}
          <chakra.span color={ACCENT}>.</chakra.span>
        </Heading>

        <Skeleton isLoaded={!loading} mt={{base: 6, md: 8}}>
          {items?.length ? (
            <Box
              position="relative"
              sx={{
                '.slick-slide > div': {px: 2},
                '.slick-list': {mx: {base: -2, md: -3}}
              }}
            >
              <Slider {...settings}>
                {items.map((post: any, i: number) => (
                  <Box key={(post.handle || post.id) + i} my={4}>
                    {/* post is already ProductCard-compatible via useJaenBlogs */}
                    <BlogCard blog={post} borderline={false} bcolor={ACCENT} />
                  </Box>
                ))}
              </Slider>
            </Box>
          ) : (
            <Text color="blackAlpha.700">Keine Blogbeiträge gefunden.</Text>
          )}
        </Skeleton>

        <HStack spacing={3} pt={{base: 8, md: 10}}>
          <Button
            as={ChakraLink}
            href="/blog"
            borderRadius="full"
            bg={ACCENT}
            color="white"
            _hover={{filter: 'brightness(1.1)'}}
            fontWeight="900"
          >
            Zum Blog
          </Button>
          <Button
            as={ChakraLink}
            href="/newsletter"
            variant="outline"
            borderRadius="full"
            borderColor="blackAlpha.400"
            color="black"
            _hover={{bg: 'blackAlpha.50'}}
            fontWeight="800"
          >
            Newsletter abonnieren
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}

// minimal Chakra arrow buttons for slick
const Arrow: FC<{dir: 'left' | 'right'; onClick?: () => void}> = ({dir, onClick}) => (
  <Box
    onClick={onClick}
    role="button"
    aria-label={dir === 'left' ? 'Vorheriger' : 'Nächster'}
    position="absolute"
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    right={dir === 'right' ? {base: 1, md: 2} : 'auto'}
    left={dir === 'left' ? {base: 1, md: 2} : 'auto'}
    bg="white"
    border="1px solid"
    borderColor="blackAlpha.200"
    boxShadow="0 8px 24px rgba(0,0,0,0.12)"
    borderRadius="full"
    w="36px"
    h="36px"
    display="grid"
    placeItems="center"
    _hover={{boxShadow: '0 12px 36px rgba(0,0,0,0.16)'}}
    cursor="pointer"
  >
    <chakra.span fontWeight="900" fontSize="lg" lineHeight="1">
      {dir === 'left' ? '‹' : '›'}
    </chakra.span>
  </Box>
)

export default BlogSlider

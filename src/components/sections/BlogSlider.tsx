// components/sections/BlogSlider.tsx
import React, {FC, useEffect, useMemo, useState} from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Tag,
  Skeleton,
  chakra,
  useBreakpointValue
} from '@chakra-ui/react'
import {keyframes} from '@emotion/react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import {usePage, Field} from 'jaen'
import {useJaenBlogs} from '../../hooks/use-blog-pages'
import {BlogCard} from '../BlogCard'

const BRAND = {accent: '#7f188c'}
const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(127,24,140,0.0); }
  100% { box-shadow: 0 0 24px rgba(127,24,140,0.35); }
`

export interface BlogSliderProps {
  blogIndex: any
  id?: string
  title?: string
  accentColor?: string
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

  const cmsMediaPage = usePage({id: 'JaenPage /cms/media/', injectMedia: true})
  const {posts, featuredPosts} = useJaenBlogs(blogIndex, cmsMediaPage, {limit: 12})
  const items = featuredOnly ? featuredPosts : posts

  const [loading, setLoading] = useState(true)
  useEffect(() => setLoading(false), [])

  const isMobile = useBreakpointValue({base: true, md: false}) ?? true
  const showArrows = !isMobile && (items?.length || 0) > 1
  const showDots = true

  // Width caps per breakpoints (keeps card readable on mobile, tame on desktop)
  const CARD_MAXW = {
    base: 'clamp(320px, 92vw, 420px)',
    sm:   'clamp(340px, 90vw, 440px)',
    md:   '360px',
    lg:   '380px',
    xl:   '420px'
  }

  // We want 3 on md+ (but not more than we have), and 1 on mobile.
  const slidesMdUp = Math.min(3, items?.length || 1)

  const settings = useMemo(
    () => ({
      // default (desktop-first): md and up
      dots: showDots,
      arrows: showArrows,
      infinite: (items?.length || 0) > slidesMdUp,
      speed: 500,
      slidesToShow: slidesMdUp,   // ✅ md and up: 3 (or fewer if not available)
      slidesToScroll: 1,
      swipeToSlide: true,
      adaptiveHeight: false,      // ✅ desktop: fixed track height
      lazyLoad: 'ondemand' as const,
      // React-Slick breakpoints are MAX-width by default.
      // < 768px → 1 card, adaptiveHeight on for tall mobile cards.
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true
          }
        }
      ],
      nextArrow: <Arrow dir="right" />,
      prevArrow: <Arrow dir="left" />
    }),
    [items?.length, slidesMdUp, showArrows, showDots]
  )

  return (
    <Box as="section" id={id} bg="white" color="black" py={{base: 8, md: 14}}>
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
          fontSize={{base: 'xl', sm: '2xl', md: '3xl'}}
          lineHeight="1.2"
          fontWeight="900"
        >
          <Field.Text
            as={chakra.span}
            display="inline"
            name="BlogSliderHeadline"
            defaultValue={title}
          />
          <chakra.span color={ACCENT}>.</chakra.span>
        </Heading>

        <Skeleton isLoaded={!loading} mt={{base: 5, md: 8}}>
          {items?.length ? (
            <Box
              position="relative"
              sx={{
                '.slick-track': {
                  display: 'flex',
                  alignItems: 'flex-start' // avoid height-stretch coupling
                },
                '.slick-slide': { height: 'auto' },
                '.slick-slide > div': {
                  px: { base: 2, md: 2.5 },
                  display: 'block'
                },
                '.slick-list': {
                  mx: { base: -2, md: -2.5 },
                  overflow: { base: 'visible', md: 'hidden' },
                  pb: { base: 2, md: 0 }
                },
                '.slick-dots': { bottom: '-32px' },
                '.slick-dots li button:before': {
                  fontSize: '10px',
                  color: `${ACCENT}99`,
                  opacity: 1
                },
                '.slick-dots li.slick-active button:before': { color: ACCENT, opacity: 1 }
              }}
            >
              <Slider {...settings}>
                {items.map((post: any, i: number) => (
                  <Box
                    key={(post.handle || post.id) + i}
                    my={{base: 2, md: 4}}
                    w="full"
                    maxW={{
                      base: CARD_MAXW.base,
                      sm: CARD_MAXW.sm,
                      md: CARD_MAXW.md,
                      lg: CARD_MAXW.lg,
                      xl: CARD_MAXW.xl
                    }}
                    mx="auto"
                  >
                    <BlogCard blog={post} borderline={false} bcolor={ACCENT} />
                  </Box>
                ))}
              </Slider>
            </Box>
          ) : (
            <Text color="blackAlpha.700" mt={2}>
              Keine Blogbeiträge gefunden.
            </Text>
          )}
        </Skeleton>
      </Container>
    </Box>
  )
}

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
    display={{base: 'none', md: 'grid'}}
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

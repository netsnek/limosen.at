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

  // 🔌 use Jaen → to BlogCard-compatible blog items
  const {posts, featuredPosts} = useJaenBlogs(blogIndex, cmsMediaPage, {
    limit: 12
  })

  const items = featuredOnly ? featuredPosts : posts

  const [loading, setLoading] = useState(true)
  useEffect(() => setLoading(false), [])

  // Mobile UX: dots on, arrows off; Desktop: arrows on when useful.
  const isMobile = useBreakpointValue({base: true, md: false}) ?? true
  const showArrows = !isMobile && (items?.length || 0) > 1
  const showDots = true

  // react-slick settings (mobile-first)
  const settings = useMemo(
    () => ({
      dots: showDots,
      arrows: showArrows,
      infinite: (items?.length || 0) > 4,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      swipeToSlide: true,
      touchThreshold: 12,
      adaptiveHeight: false,
      lazyLoad: 'ondemand' as const,
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: 4 } },
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768,  settings: { slidesToShow: 2, arrows: false } },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1, arrows: false, centerMode: true, centerPadding: '16px' }
        }
      ],
      nextArrow: <Arrow dir="right" />,
      prevArrow: <Arrow dir="left" />
    }),
    [items?.length, showArrows, showDots]
  )

  return (
    <Box as="section" id={id} bg="white" color="black" py={{base: 8, md: 16}}>
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

        {/* Editable headline via Jaen Field.Text */}
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
                '.slick-slide > div': {px: {base: 1.5, md: 2.5}, height: '100%'},
                '.slick-list': {mx: {base: -1.5, md: -2.5}, overflow: 'hidden'},
                '.slick-track': {display: 'flex', alignItems: 'stretch'},
                '.slick-slide': {height: 'auto'},
                '.slick-dots': {bottom: '-32px'},
                '.slick-dots li button:before': {fontSize: '10px', color: `${ACCENT}99`, opacity: 1},
                '.slick-dots li.slick-active button:before': {color: ACCENT, opacity: 1}
              }}
            >
              <Slider {...settings}>
                {items.map((post: any, i: number) => (
                  <Box key={(post.handle || post.id) + i} my={{base: 2, md: 4}} h="100%">
                    <Box h="100%">
                      <BlogCard blog={post} borderline={false} bcolor={ACCENT} />
                    </Box>
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
    display={{base: 'none', md: 'grid'}}
    placeItems="center"
    _hover={{boxShadow: '0 12px 36px rgba(0,0,0,0.16)'}}
    cursor="pointer"
    onClick={onClick}
  >
    <chakra.span fontWeight="900" fontSize="lg" lineHeight="1">
      {dir === 'left' ? '‹' : '›'}
    </chakra.span>
  </Box>
)

export default BlogSlider

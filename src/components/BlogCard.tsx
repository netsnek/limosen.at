import React from 'react';
import {
  AspectRatio,
  Badge,
  Box,
  BoxProps,
  Flex,
  Image,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as GatsbyLink } from 'gatsby';
import { css } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';

// Define the blog interface for better type safety
interface Blog {
  handle: string;
  tags?: string[];
  title: string;
  description?: string;
  price?: string; // Price as a string to include currency symbol
  compareAtPrice?: string;
  discount?: string;
  createdAt: string;
  featuredMedia?: {
    image: {
      src: string;
      altText?: string | null;
    };
  };
  media?: Array<{
    image: {
      src: string;
      altText?: string | null;
    };
  }>;
  taxable?: boolean;
}

export interface BlogCardProps {
  blog: Blog;
  borderline?: boolean;
  left?: boolean;
  bwidth?: string;
  bcolor?: string;
  prefixPath?: string;
  isMobile?: boolean;
}

// CSS-in-JS styling using Emotion
const borderColor = (color?: string) => (color ? color : '#f77f00');
const transformWidth = (width?: string) =>
  width ? 'scaleX(1.' + width.split('%')[0] + ')' : 'scaleX(1.3)';
const borderlinWidth = (width?: string) => (width ? width : '30%');

export const cardStyle = (
  borderline?: boolean,
  bwidth?: string,
  color?: string,
  left?: boolean
) => css`
  .pcard {
    display: block;
    position: relative;
    border-collapse: collapse;
    text-decoration: none;
    transition: all 150ms;
    z-index: 1;

    * {
      text-decoration: none;
    }

    .borderline {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      right: 0%;
      border-collapse: collapse;
      text-decoration: none;

      &:before {
        box-sizing: border-box;
        transition: all 150ms;
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        left: 50%;
        margin-left: -50%;
        top: 0%;
        border-color: rgba(255, 255, 255, 0);
        border-style: solid;
        border-width: 0 2px;
        border-radius: var(--chakra-radii-2xl);
        background-color: #fff;
        z-index: 1;
      }

      &:after {
        box-sizing: border-box;
        transition: all 150ms;
        position: absolute;
        content: '';
        width: 50%;
        height: 100%;
        left: 50%;
        margin-left: -25%;
        top: 0;
        border-color: rgba(255, 255, 255, 0);
        border-style: solid;
        border-width: 2px 0;
        border-radius: var(--chakra-radii-2xl);
      }
    }

    .bspacer {
      ${left ? 'left: 0' : 'right: 0'}
    }

    .imgline {
      opacity: 0;
      z-index: 1;
      top: 0;
      ${left ? 'right: calc(100% * (1/1.3));' : 'left: calc(100% * (1/1.3));'}
      width: calc(${borderlinWidth(bwidth)} * (1/1.3));
    }

    &:hover {
      transform: scale(1.03);
      z-index: 2;
    }

    &:hover .borderline {
      position: absolute;
      top: 0;
      animation: ${left ? 'scale-up-hor-left' : 'scale-up-hor-right'} 200ms
        cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
      ${borderline ? '' : 'animation: none;'}
    }

    &:hover .borderline:after {
      width: 100%;
      margin-left: -50%;
      border-color: ${borderColor(color)};
    }

    &:hover .borderline:before {
      height: calc(100% - 4px);
      top: 2px;
    }
    &:hover .imgline {
      ${borderline ? '' : 'display: none;'}
      opacity: 1;
      animation: opacity-up-hor 400ms ease-in 0ms 1 normal none;
    }
    .radioimg {
      display: none;
    }
    .radioimg + .preview {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      opacity: 0;
      height: 100%;
      width: 100%;
      transition: all 350ms;
    }
    .radioimg:checked + .preview {
      opacity: 1;
    }
    .radioimg + .main {
      opacity: 0;
      transition: all 350ms;
    }
    .radioimg:checked + .main {
      opacity: 1;
    }
  }

  @keyframes opacity-up-hor {
    0% {
      opacity: 0;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes scale-up-hor-right {
    0% {
      transform: scaleX(1.03);
      transform-origin: 0% 0%;
    }
    100% {
      transform: ${transformWidth(bwidth)};
      transform-origin: 0% 0%;
    }
  }

  @keyframes scale-up-hor-left {
    0% {
      transform: scaleX(1.03);
      transform-origin: 100% 0%;
    }
    100% {
      transform: ${transformWidth(bwidth)};
      transform-origin: 100% 0%;
    }
  }
`;

function ImageBoxWithTags(
  props: {
    image?: {
      src: string;
      altText?: string | null;
    };
    tags: Array<{ name: string; color: string; bg: string }>;
    className?: string;
    objectFit?: 'cover' | 'contain';
  } & BoxProps
) {
  const { image, tags, className, objectFit = 'cover' } = props;

  return (
    <Box overflow="hidden" position="relative" className={className} {...props}>
      {image ? (
        <Image
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
          src={image.src}
          alt={image.altText || '-'}
          style={{
            height: '100%',
            width: '100%',
            objectFit: objectFit,
            objectPosition: 'center',
          }}
        />
      ) : (
        'no image'
      )}
      <Flex position="absolute" top="0" left="0" right="0" p={2}>
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="solid"
            fontSize="sm"
            fontWeight="semibold"
            rounded="md"
            px={2}
            mr={2}
            mt={2}
            color={tag.color}
            bgColor={tag.bg}
            textTransform="none"
          >
            {tag.name}
          </Badge>
        ))}
      </Flex>
    </Box>
  );
}

export const BlogCard = ({
  blog,
  borderline,
  left,
  bwidth,
  bcolor,
  prefixPath,
  isMobile,
}: BlogCardProps) => {
  // Construct the path to the blog page
  const prefixPathTrimmed = prefixPath
    ? prefixPath.trim().replace(/\/+$/, '')
    : '';
  const path = `${prefixPathTrimmed}/docs/${blog.handle}`;

  // Ref for radio inputs to control image previews
  const radioRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Get blog tags or default to empty array
  const tags = blog.tags || [];

  // Price handling
  let priceFormatted = blog.price;
  // If price is '0€' or undefined, display 'Gratis'
  if (!priceFormatted || priceFormatted === '0€') {
    priceFormatted = undefined;
  }

  // Determine if the border line should be displayed
  borderline = borderline !== undefined ? borderline : true;

  // Prepare media for previews
  const previewMedia = blog.media || [];

  if (previewMedia.length === 0) {
    borderline = false;
  }
  if (isMobile) {
    borderline = false;
  }

  // Generate a unique ID for radio inputs
  const cardId = uuidv4();

  // Determine if the border line should be displayed
  borderline = borderline !== undefined ? borderline : true;

  // Prepare badges for 'Neu' (New) and discount
  const coloredBadges: Array<{ name: string; color: string; bg: string }> = [];

  // Check if the blog is new (created within the last 7 days) or has 'Neu' tag
  if (
    tags.includes('Neu') ||
    new Date(blog.createdAt).getTime() >
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ) {
    coloredBadges.push({ name: 'Neu', color: 'white', bg: 'brand.500' });
  }

  // Check for discounts
  if (blog.discount) {
    coloredBadges.push({
      name: blog.discount,
      color: 'white',
      bg: 'agt.red',
    });
  }

  const [loading, setLoading] = React.useState(true);
  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 200);
  //   return () => clearTimeout(timer);
  // }, []);

  // loading should be set to false when dom is rendered
  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <VStack
      as={GatsbyLink}
      to={path}
      display={'block'}
      css={cardStyle(borderline, bwidth, bcolor, left)}
      boxSize={'full'}
      cursor="pointer"
      textAlign={{
        base: 'center',
        md: 'left',
      }}
    >
      <Box
        className="pcard"
        position="relative"
        cursor="pointer"
        bg="primary"
        px={{ base: '1', md: '2', lg: '3' }}
        py="5"
        minH={'full'}
        borderRadius="2xl"
      >
        {/* Adjust layout based on screen size */}
        <Flex direction={isMobile ? 'row' : 'column'} align="stretch">
          {/* Image section */}
          <Box
            position="relative"
            flex={isMobile ? '0 0 40%' : '1'}
            mr={isMobile ? '4' : '0'}
          >
            <AspectRatio ratio={isMobile ? 4 / 3 : 10 / 9}>
              <Skeleton isLoaded={!loading}>
                {/* Radio input for the featured image */}
                <input
                  type="radio"
                  className="radioimg"
                  name={'imgbox-' + cardId}
                  id={'imgbox-' + cardId + '-featured'}
                  ref={(el) => (radioRef.current[0] = el)}
                  readOnly
                  defaultChecked
                />
                <ImageBoxWithTags
                  image={blog.featuredMedia?.image}
                  tags={coloredBadges}
                  className="main"
                  objectFit="cover" // Featured image uses 'cover'
                />
                {/* Radio inputs for preview images */}
                {previewMedia.map((media, index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className="radioimg"
                      name={'imgbox-' + cardId}
                      id={'imgbox-' + cardId + '-media-' + index}
                      ref={(el) => (radioRef.current[index + 1] = el)}
                      readOnly
                    />
                    <ImageBoxWithTags
                      image={media.image}
                      tags={[]}
                      className="preview"
                      objectFit="contain" // Preview images use 'contain'
                    />
                  </React.Fragment>
                ))}
              </Skeleton>
            </AspectRatio>
          </Box>

          {/* Text content section */}
          <Box flex="1" mt={isMobile ? '0' : '4'}>
            {/* Display blog tags (other than 'Neu') */}
            <Text fontSize="sm" noOfLines={1}>
              {tags.filter((tag) => tag !== 'Neu').join(', ')}&nbsp;
            </Text>

            {/* Blog title */}
            <Text fontSize={'2xl'} fontWeight="bold">
              {blog.title}
            </Text>

            {/* Blog description */}
            <Text fontSize="md" noOfLines={2}>
              {blog.description}
            </Text>

            {/* Blog price */}
            {/* {priceFormatted ? (
              <>
                <Text fontSize="lg" fontWeight="semibold" color="agt.red" mt="4">
                  {priceFormatted}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {blog.taxable ? 'inkl.' : 'exkl.'} Ust.
                </Text>
              </>
            ) : (
              <Text fontSize="lg" fontWeight="semibold" color="agt.red" mt="4">
                Gratis
              </Text>
            )} */}
          </Box>
        </Flex>

        {/* Spacer and borderline for hover effects */}
        <Spacer
          position="absolute"
          className="bspacer"
          w="0"
          h="90%"
          top="5%"
          borderLeft="1px"
          borderColor="#f9f9f9"
          transform="scale(0.97)"
        />
        <Box
          className="borderline"
          cursor="pointer"
          bg="white"
          px={{ base: '1', md: '2', lg: '3' }}
          py="5"
          borderRadius="2xl"
          border="1px"
          borderColor="#f9f9f9"
          boxShadow="sm"
        >
          {/* Image preview line */}
          <VStack
            className="imgline"
            position="absolute"
            opacity="0"
            boxSize={'full'}
            py="calc(var(--chakra-space-5) - 2px)"
            px="1"
          >
            {previewMedia.slice(0, 3).map((media, index) => (
              <label
                htmlFor={'imgbox-' + cardId + '-media-' + index}
                key={index}
              >
                <Box
                  transform="scale(0.97)"
                  borderBottom="1px"
                  borderColor="#f9f9f9"
                  _hover={{ borderColor: 'agt.red' }}
                  onMouseOver={() => {
                    if (radioRef.current[index + 1]) {
                      radioRef.current[index + 1]!.checked = true;
                    }
                  }}
                  onMouseLeave={() => {
                    if (radioRef.current[0]) {
                      radioRef.current[0]!.checked = true;
                    }
                  }}
                >
                  <Image
                    onDragStart={(e) => e.preventDefault()}
                    draggable="false"
                    src={media.image.src}
                    alt={media.image.altText || '-'}
                    style={{
                      height: 'auto',
                      width: '100%',
                      objectFit: 'contain', // Preview images use 'contain'
                      objectPosition: 'center',
                    }}
                  />
                </Box>
              </label>
            ))}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};

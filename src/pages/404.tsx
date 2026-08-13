import {PageConfig} from 'jaen'
import {chakra, Box, Heading, Text, Button} from '@chakra-ui/react'
import {graphql, Link, PageProps} from 'gatsby'

// import HBalloon from '../common/assets/hballoon.inline.svg'

const Page = (props: PageProps) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      {/* v3 reads bgGradient as the direction alone and takes the stops from
          gradientFrom/Via/To. v2's `linear(...)` string still type-checks here,
          because the prop accepts any string, but it reaches the browser as an
          unparseable background-image and is dropped, so both gradients on this
          page had gone invisible. */}
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="to-r"
        gradientFrom="brand.400"
        gradientTo="brand.600"
        backgroundClip="text">
        {/* <chakra.svg
          as={HBalloon}
          mt="14"
          h={{
            base: '44',
            xl: 'xs'
          }}
        /> */}
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Seite nicht gefunden
      </Text>
      <Text color={'gray.500'} mb={6}>
        Diese Seite existiert nicht.
      </Text>

      <Button
        bgGradient="to-r"
        gradientFrom="brand.400"
        gradientVia="brand.500"
        gradientTo="brand.600"
        color="white"
        variant="solid"
        asChild>
        <Link to="/">Zurück zur Startseite</Link>
      </Button>
    </Box>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Oops! Page not found',
  childTemplates: []
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
  }
`

export {Head} from 'jaen'
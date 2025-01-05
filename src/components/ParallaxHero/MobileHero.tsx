import {Box, HStack, Stack, chakra} from '@chakra-ui/react'
import {Ballons} from '../../../common/assets/Ballons'
import HBalloon from '../../../common/assets/hballoon.inline.svg'
import SkylineL1 from '../../../common/assets/skyline1.inline.svg'
import SkylineL2 from '../../../common/assets/skyline2.inline.svg'
import SkylineL3 from '../../../common/assets/skyline3.inline.svg'
import {CONTAINER_MAX_WIDTH} from '../../../constant/sizes'
import LinkButtonField from '../../fields/LinkButtonField'
import {useScrollSync} from '../../hooks/scroll'
import BallonSvg from '../ParallaxBackground/BallonSvg'
import * as style from './style'

export const MobileHero = () => {
  const {ref, scrollTop} = useScrollSync()

  const noScroll = false

  return (
    <Box
      //bgColor={'white'}
      css={style.Section(noScroll)}>
      <chakra.svg
        as={SkylineL1}
        position={'absolute'}
        top={'0'}
        left={'0'}
        width={'100%'}
        minWidth={'2500px'}
      />
      <chakra.svg
        as={SkylineL2}
        position={'absolute'}
        top={'0'}
        left={'0'}
        width={'100%'}
        minWidth={'2500px'}
      />
      <chakra.svg
        as={SkylineL3}
        position={'absolute'}
        top={'0'}
        left={'0'}
        width={'100%'}
        minWidth={'2500px'}
      />
      <Stack
        maxW={CONTAINER_MAX_WIDTH}
        height={'calc(100vh - 7.5rem)'}
        pb="48"
        w={'100%'}
        top={'0'}
        position={'relative'}
        justifyContent="center"
        alignItems={'center'}
        display={{base: 'flex', md: 'none'}}>
        <HStack mt="24">
          <BallonSvg as={HBalloon} className="background-Ballon" />
          {/* <Field.Text
            as={Heading}
            name="heroTextBallons"
            defaultValue="<i>Ballons</i>"
            fontSize={{base: '2xl', md: '8xl', lg: '9xl'}}
            fontWeight="semibold"
            textAlign="center"
            pt="2"
          /> */}
          <Ballons
            mb={12}
            mx={'auto'}
            color={'red.500'}
            h={{base: '4.5rem', md: '8.25rem', lg: '8.875rem'}}
            w="auto"
          />
        </HStack>
        <Stack alignItems={'center'}>
          <LinkButtonField
            name="heroButton2"
            defaultValue="Großhandel"
            defaultUrl={`/grosshandel`}
            size={{base: 'sm', md: 'md'}}
            variant="outline"
            ml="3"
          />
          <LinkButtonField
            name="heroButton1"
            defaultValue="Zum Shop"
            defaultUrl={`/products`}
            size={{base: 'sm', md: 'md'}}
            ml="3"
            mt="3"
          />
        </Stack>
        <Box
          position={'absolute'}
          bottom={'10%'}
          left={'50%'}
          id="scrollarrows"
          alignSelf="flex-end"
          h="100px"
          visibility={scrollTop < 100 ? 'visible' : 'hidden'}>
          <span></span>
          <span></span>
          <span></span>
        </Box>
      </Stack>
    </Box>
  )
}

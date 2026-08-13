import {Checkbox, CheckboxRootProps} from '@chakra-ui/react'
import {forwardRef} from 'react'

const bgColor = '#EDEDF0'
const controlColor = 'brand.500'
const focusColor = '#B4BBE2'

const defaultClasses = ({radius = '1px', controlRadius = '1px'}) => {
  return {
    h: '40px',
    px: '12px',
    w: 'fit-content',
    _checked: {
      bg: bgColor,
      h: '40px',
      px: '12px',
      borderRadius: radius
    },
    // Two changes from v2's `span[class*='checkbox__control']:not(...)`.
    //
    // The tag qualifier is gone because v3 renders Checkbox.Control as a div
    // where v2 rendered a span. Left as `span[...]` these rules would simply
    // stop matching and the control would lose its brand border and its ring.
    //
    // The leading `& ` is not cosmetic: v2's emotion `sx` treated any key with a
    // nested object as a selector, v3's css engine only does that for keys
    // starting with `&` or `@`. A bare key is sorted as a PROPERTY, and because
    // `w` and `position` already exist at the top level the merge then tries to
    // hang `&::after` off a string and throws, which takes the whole modal
    // subtree down with it.
    "& [class*='checkbox__control']:not([data-disabled])": {
      borderColor: controlColor,
      borderRadius: controlRadius,
      _checked: {
        bg: controlColor,
        borderColor: controlColor
      },
      _focus: {
        boxShadow: `0 0 0 2px ${focusColor}`,
        _checked: {
          boxShadow: `0 0 0 2px ${focusColor}`
        }
      },
      _after: {
        transitionProperty: 'all',
        // v2's `durations.normal` = 200ms. v3 renamed the scale (fastest,
        // faster, fast, moderate, slow, slower, slowest), so `normal` no longer
        // resolves and the literal string reaches the browser, which drops it
        // and the halo snaps open instead of growing.
        transitionDuration: '200ms',
        content: `""`,
        position: 'absolute',
        width: '0px',
        height: '0px',
        bg: `transparent`,
        borderRadius: radius,
        zIndex: -1
      }
    },
    _hover: {
      "& [class*='checkbox__control']:not([data-disabled])": {
        _after: {
          width: '40px',
          height: '40px',
          bg: bgColor,
          borderColor: controlColor
        }
      }
    }
  }
}

export interface CheckboxStyledProps extends CheckboxRootProps {
  roundedFull?: boolean
}

export const CheckboxStyled = forwardRef<HTMLInputElement, CheckboxStyledProps>(
  // `rounded` is a border-radius style prop being read as a boolean flag and
  // swallowed rather than forwarded. That is how v2 had it, and the only caller
  // passes `roundedFull`, so it is left alone.
  ({children, gap = '1rem', rounded, roundedFull, ...props}, ref) => {
    let classes = defaultClasses({})

    if (roundedFull) {
      classes = defaultClasses({radius: '99px', controlRadius: '99px'})
    }

    if (rounded) {
      classes = defaultClasses({radius: '8px', controlRadius: '2px'})
    }

    return (
      // The ref lands on the hidden input, which is where v2's Checkbox
      // forwarded it and what react-hook-form's Controller expects to find.
      <Checkbox.Root gap={gap} css={classes} {...props}>
        <Checkbox.HiddenInput ref={ref} />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{children}</Checkbox.Label>
      </Checkbox.Root>
    )
  }
)

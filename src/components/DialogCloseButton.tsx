import {CloseButton, Dialog} from '@chakra-ui/react'
import {FC} from 'react'

/**
 * v2's `<ModalCloseButton/>`, rebuilt on v3's parts.
 *
 * Two separate problems had to be solved.
 *
 * 1. v3's `<Dialog.CloseTrigger/>` draws NOTHING of its own. It is a bare ark
 *    button and the `closeTrigger` slot only positions it, so left childless the
 *    modal simply has no visible X. v2's ModalCloseButton delegated to
 *    CloseButton, so one is handed to it here.
 *
 * 2. A plain `<CloseButton/>` is not enough either. In v2 CloseButton was its own
 *    theme key and never saw the site's Button styleConfig. In v3 CloseButton IS
 *    an IconButton, so it runs through the site's button recipe: it picks up the
 *    md size (2.5rem tall, 20px icon), the `ghost` variant's own hover shades and
 *    `colorPalette.fg`, which with the site's brand colorPalette would paint the
 *    X gold.
 *
 * Every value below is read off v2's CloseButton rule:
 *
 *   width/height   var(--close-button-size) = sizes.8 (2rem)
 *   border-radius  radii.md
 *   font-size      fontSizes.xs   -> the icon is 1em, i.e. 12px
 *   color          inherited from the modal content
 *   background     transparent, blackAlpha.100 on hover, .200 on active
 *   position       absolute, top space.2, right space.3
 *
 * `insetEnd` is the one value that lives on the trigger rather than the button:
 * v3's dialog recipe positions the slot at insetEnd 2 where v2's modal used 3.
 *
 * One copy for all three dialogs, the way the sibling site keeps it: both modals
 * and the home page's language dialog import this file.
 */
export const DialogCloseButton: FC = () => (
  <Dialog.CloseTrigger asChild insetEnd="3">
    <CloseButton
      size="xs"
      boxSize="8"
      px="0"
      borderRadius="md"
      // v2's close button had no colour of its own and inherited the modal's.
      color="inherit"
      // `bgColor`, not `bg`: the css engine emits the `background` shorthand
      // before the `background-color` longhand, so a `bg` here would lose to any
      // `bgColor` the ghost variant sets. The longhand always wins.
      _hover={{bgColor: 'blackAlpha.100'}}
      _active={{bgColor: 'blackAlpha.200'}}
      // v3's button recipe sizes icons through `& :where(svg)`: a fixed sizes.4
      // (16px) and, less obviously, `font-size: 1.2em`. v2's CloseIcon was plain
      // 1em of the button's own fontSize xs, i.e. 12px, so the 1.2em has to be
      // cancelled as well or 1em resolves to 14.4px. A real `& svg` (0,1,1)
      // outranks `:where(svg)` (0,1,0), so this wins by specificity rather than
      // by source order.
      css={{'& svg': {fontSize: '1em', width: '1em', height: '1em'}}}
    />
  </Dialog.CloseTrigger>
)

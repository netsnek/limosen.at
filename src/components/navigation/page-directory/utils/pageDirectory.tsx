import {
  ArrowForwardIcon,
  ChevronDownIcon
} from '../../../../components/icons/chakra';
import {
  Accordion,
  AccordionItemTriggerProps,
  Box,
  Center,
  CenterProps,
  LinkProps
} from '@chakra-ui/react';
import { Link } from 'gatsby-plugin-jaen';
import { MouseEvent, createRef } from 'react';
import { NavMenuItem } from '../../../../utils/navigation/types';
import {
  activeMenuItemProps,
  inactiveMenuItemProps
} from '../vars/pageDirectory';

/**
 * Handles clicks on links in the main navigation menu. If the target is not an anchor element, the default action is prevented, which prevents the page from reloading.
 * @param ev  The click event that triggered the handler
 */
const linkClickHandler = (ev: MouseEvent<HTMLAnchorElement>) => {
  if (
    ev.target instanceof HTMLAnchorElement ||
    ev.target instanceof HTMLButtonElement ||
    ev.target instanceof HTMLSpanElement
  )
    return;
  ev.preventDefault();
};

/**
 * Generates a menu item for the main navigation menu.
 * @param item  The menu item to generate
 * @param isMobile  Whether or not the menu is being generated for mobile. If true, sections will be included.
 * @param closeMobileDrawer  A function to close the mobile drawer. Only required if isMobile is true.
 * @returns
 */
export const generateMenuItem = (
  item: NavMenuItem,
  isMobile: boolean,
  updateExpandedIdx: (idx: number, mode: 'toggle' | 'set') => void,
  expandedIdx: number,
  closeMobileDrawer?: () => void
) => {
  if (!isMobile && item.isSection) return { idx: expandedIdx };

  const accordionItemRef = createRef<HTMLDivElement>();

  const externalLinkIcon = (
    <ArrowForwardIcon transform={`rotate(-45deg)`} ml={2} />
  );

  const styleProps: CenterProps & AccordionItemTriggerProps & LinkProps = {
    // v2 replaced a recipe's `_hover` wholesale with this object, which is how
    // the leaf links below lost the link recipe's underline. v3 merges the two,
    // so the underline has to be turned off by hand.
    _hover: { opacity: 1, textDecoration: 'none' }
  };
  if (item.isActive)
    styleProps.backgroundColor = 'leftNav.accordion.activeItem.bgColor';
  else if (styleProps._hover)
    styleProps._hover.backgroundColor =
      'leftNav.accordion.inactiveItem.hoverBgColor';

  // Check if the item has children and is not a section (except on mobile)
  const hasChildren =
    item.children &&
    item.children.length > 0 &&
    (isMobile || item.children.some(child => !child.isSection));

  const resultObj: { idx: number; item?: JSX.Element | JSX.Element[] } = {
    idx: expandedIdx
  };

  if (hasChildren) {
    resultObj.idx++;
    const children = item.children?.map(child => {
      const res = generateMenuItem(
        child,
        isMobile,
        updateExpandedIdx,
        resultObj.idx,
        closeMobileDrawer
      );
      resultObj.idx = res.idx;
      return res;
    });
    const semanticPath = `leftNav.accordion.${
      item.isActive ? '' : 'in'
    }activeItem.`;
    resultObj.item = (
      <Accordion.Item
        ref={accordionItemRef}
        key={item.href + item.name}
        // v2 kept href+name as the item's DOM id and expanded items by their
        // numeric position. v3 expands by value, so the value has to carry that
        // same position, which is what PageDirectory holds in its state.
        value={String(expandedIdx)}
        css={{
          // Remove padding from last accordion item. v3 moved the panel's
          // padding from the panel itself onto the body slot inside it.
          '& .chakra-accordion__itemBody': {
            paddingBottom: 0
          }
        }}
        my={1}
        // This is a hack to remove the bottom border from the last accordion item
        borderBottomWidth="0 !important"
      >
        <Link
          to={item.href}
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            const target = e.target as HTMLElement;
            const hasClickedOnArrow =
              target instanceof SVGElement || target instanceof SVGPathElement;
            updateExpandedIdx(
              expandedIdx,
              hasClickedOnArrow ? 'toggle' : 'set'
            );
            linkClickHandler(e);
            if (!hasClickedOnArrow && closeMobileDrawer) {
              closeMobileDrawer();
            }
          }}
        >
          <Accordion.ItemTrigger
            // v2's accordion baseStyle put `px: 4` and `fontWeight: normal` on
            // the button; v3's recipe has neither and adds `fontWeight: medium`
            // instead. The px is what lines these labels up with the leaf links
            // below, which carry the same 4 by hand.
            px={4}
            fontWeight="normal"
            {...(item.isActive ? activeMenuItemProps : inactiveMenuItemProps)}
            {...styleProps}
            borderRadius="md"
            py={1.5}
            // v3's trigger sets gap 3 between the label and the chevron, where
            // v2's had none.
            gap={0}
            backgroundColor={
              item.isActive ? semanticPath + 'bgColor' : undefined
            }
          >
            <Box as="span" flex="1" wordBreak="break-all">
              {item.name}
              {item.isExternal && externalLinkIcon}
            </Box>
            <Center
              {...styleProps}
              as="span"
              borderRadius="sm"
              transition="background-color 0.2s ease-in-out"
              backgroundColor="transparent"
              _hover={{
                bgColor: semanticPath + 'button.icon.hoverContainerBgColor'
              }}
            >
              <Accordion.ItemIndicator
                className="prv-link"
                opacity="inherit"
                // v2's AccordionIcon had no colour of its own and took the
                // trigger's; v3's indicator paints itself `fg.subtle`.
                color="inherit"
                // v2 read the item's open state from the render prop and turned
                // the glyph itself, v3 exposes that state as data-state.
                transform="rotate(-90deg)"
                // v3's base recipe turns the open indicator with the CSS
                // `rotate` property, which composes with `transform` rather
                // than replacing it, so it has to be pinned back to zero for
                // the arrow to land where v2 put it.
                _open={{ transform: 'rotate(0deg)', rotate: '0deg' }}
                // v2's AccordionIcon carried `transition: transform 0.2s` of
                // its own, which this call site never overrode. v3's recipe
                // transitions `rotate` instead, so the transform above would
                // have snapped.
                transition="transform 0.2s"
              >
                {/* v2's AccordionIcon was Chakra v2's own ChevronDown at
                    `fontSize: 1.25em`, which is the glyph vendored into
                    icons/chakra. An ItemIndicator with no children falls back
                    to v3's built-in chevron instead, a different path that
                    renders a visibly different arrow at this size. */}
                <ChevronDownIcon boxSize="1.25em" />
              </Accordion.ItemIndicator>
            </Center>
          </Accordion.ItemTrigger>
        </Link>
        <Accordion.ItemContent position="relative">
          {/* v2's panel baseStyle was `pt: 2, px: 4, pb: 5`. v3's itemBody
              keeps the pt and the pb, which the css above zeroes anyway, but
              not the px, and the px is the indent step between a parent item
              and its children. */}
          <Accordion.ItemBody px={4}>
            <Box
              _before={{
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 2,
                borderRadius: 'full',
                left: '10px',
                width: '1px',
                height: 'calc(100% - 0.5rem)',
                backgroundColor: 'leftNav.accordion.panel.borderLeftColor'
              }}
            >
              {children?.map(child => child.item)}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    );
  } else {
    resultObj.item = (
      <Link
        {...(item.isActive ? activeMenuItemProps : inactiveMenuItemProps)}
        {...styleProps}
        key={item.href + item.name}
        to={item.href}
        // v2's `isExternal`, spelled out: v3's Link dropped the prop and keeps
        // only the two attributes it used to set. Left on the call site rather
        // than left to jaen's Link, which only takes its external branch when
        // `to` itself looks external.
        {...(item.isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        display="block"
        py={1.5}
        px={4}
        mt={1}
        cursor="pointer"
        borderRadius="md"
        onClick={closeMobileDrawer}
        onClickCapture={item.onClick}
      >
        {item.isSection && (
          <Box key={-5} as="span" mr={2} fontSize="sm" color="gray.400">
            #
          </Box>
        )}
        {item.name}
        {item.isExternal && externalLinkIcon}
      </Link>
    );
  }
  return resultObj;
};

import {
  Center,
  VStack,
  useDisclosure,
  Text,
  Box,
  BoxProps,
  ButtonProps,
  Separator
} from '@chakra-ui/react';
import {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { FaFlask } from '@react-icons/all-files/fa/FaFlask';

import {
  fetchDefaultSearchresult,
  searchDocs,
  searchSocialPosts,
  searchUser
} from '../../utils/search';
import useSearch from '../../hooks/use-search';
import {
  SearchResultSection,
  SearchResultSectionTitle
} from './SearchResultSection';
import SearchButton from './SearchButton';
import SearchModal from './SearchModal';
import TbBooks from '../icons/tabler/TbBooks';
import TbUser from '../icons/tabler/TbUser';
import { useAuth } from 'jaen';
import { navigate } from 'gatsby';
import { useSearchContext } from '../../contexts/search';
import { TSearchResults } from '../../utils/search/types';
import { useDebounce } from 'use-debounce';
import { useLocation } from '@reach/router';

interface SearchMenuProps extends ButtonProps {}

/**
 * Search menu component - shows a navigatable list of search results
 */
const SearchMenu: FC<SearchMenuProps> = ({ ...props }) => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [navigateIdx, setNavigateIdx] = useState<number>(-1);
  const modalDisclosure = useDisclosure();
  const ref = useRef<{
    searchTimout: NodeJS.Timeout | undefined;
    changedQuery: boolean;
  }>({
    searchTimout: undefined,
    changedQuery: false // We use this to prevent the menu from fetching the default search results on first render since this is already done in the context provider
  });
  const currentUserId = '1';

  const [query] = useDebounce(searchQuery, 500);

  const search = useSearch(query);

  console.log('the search', search);

  const location = useLocation();

  useEffect(() => {
    // close the modal when the location changes
    modalDisclosure.onClose();
  }, [location]);

  useEffect(() => {
    // Focus the input when the user presses the shortcut
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const el = document.activeElement as HTMLElement;

        // Check if the current active element is not contenteditable
        if (
          el.isContentEditable ||
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA'
        )
          return;

        onOpen();

        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, []);

  /**
   * The search result items to display in the search modal
   */
  // const resultItems = useMemo(() => {
  //   const output: ReactNode[] = [];
  //   let itemIdx = 0;
  //   let sectionIdx = 0;

  //   const haveSomeResults = search.searchResult.length > 0;

  //   if (!haveSomeResults && searchQuery.length > 0) {
  //     return [
  //       <Center
  //         w="full"
  //         my={3}
  //         fontSize="sm"
  //         color="features.search.noResults.text.color"
  //       >
  //         No results found for "
  //         <Text as="span" fontStyle="italic">
  //           {searchQuery}
  //         </Text>
  //         ". Please try another search.
  //       </Center>
  //     ];
  //   }

  //   // Mark the item as highlighted if its index matches the navigateIdx
  //   // if (navigateIdx >= 0) {
  //   //   search.searchResult.forEach(section => {
  //   //     section.sections.find(subSection => {
  //   //       subSection.results.forEach(item => {
  //   //         if (itemIdx++ === navigateIdx) {
  //   //           item.isActive = true;
  //   //           return true;
  //   //         }
  //   //         if (item.isActive) item.isActive = false;
  //   //         return false;
  //   //       });
  //   //       return false;
  //   //     });
  //   //   });
  //   // }
  //   itemIdx = 0; // Reset the item index

  //   for (const key in search.searchResult) {
  //     const isDocs = key === 'docs' && searchQuery.length > 0;
  //     const section =  search.searchResult[key as keyof TSearchResults];
  //     if (haveSomeResults && section.sections.length === 0) continue;
  //     output.push(
  //       <Fragment key={itemIdx}>
  //         {itemIdx > 0 && <Divider />}
  //         <SearchResultSectionTitle
  //           title={section.title}
  //           idx={itemIdx * -1}
  //           color="features.search.section.title.color"
  //           textTransform="none"
  //           {...(!section.icon && {
  //             mb: 5
  //           })}
  //         />
  //         <VStack
  //           spacing={1}
  //           w="full"
  //           textAlign="left"
  //           _last={{
  //             mb: 2
  //           }}
  //           maxH="205px"
  //           overflowY="auto"
  //           className="sd-search-outer-section"
  //         >
  //           {section.sections.map(subSection => (
  //             <SearchResultSection
  //               section={subSection}
  //               idx={itemIdx}
  //               query={searchQuery}
  //               key={itemIdx}
  //               defaultHighlight={itemIdx++ === 0}
  //               icon={section.icon}
  //               isDocs={isDocs}
  //             />
  //           ))}
  //         </VStack>
  //       </Fragment>
  //     );
  //     sectionIdx++;
  //   }
  //   return output;
  // }, [search.searchResult, navigateIdx]);

  useEffect(() => {
    if (navigateIdx >= 0) {
      const item = document.getElementById(`sd-search-ri-${navigateIdx}`);

      if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [search.searchResult]);

  /**
   * Navigate to the next or previous item in the search results
   * @param isUp Whether to navigate up or down
   */
  const handleNavigate = (isUp: boolean) => {
    const itemsCount = Object.values(search.searchResult)
      .map(chapter => chapter.sections)
      .flat()
      .map(section => section.results)
      .flat().length;

    if (isUp) {
      if (navigateIdx > 0) setNavigateIdx(navigateIdx - 1);
      else setNavigateIdx(itemsCount - 1);
      return;
    }
    if (navigateIdx < itemsCount - 1) setNavigateIdx(navigateIdx + 1);
    else setNavigateIdx(0);
  };

  const data = useMemo(() => {
    let dataItemIdx = 0;

    return Object.values(search.searchResult).map(chapter => {
      return {
        ...chapter,
        sections: chapter.sections.map(section => {
          return {
            ...section,
            results: section.results.map(result => {
              return {
                ...result,
                isActive: dataItemIdx++ === navigateIdx
              };
            })
          };
        })
      };
    });
  }, [search.searchResult, navigateIdx]);

  console.log('DATA', data);
  /**
   * Navigate to the active item's href
   */
  const handleOpenActiveItem = () => {
    const activeItem = data
      .map(chapter => chapter.sections)
      .flat()
      .map(section => section.results)
      .flat()
      .find(item => item.isActive);

    if (activeItem) {
      modalDisclosure.onClose();
      navigate(activeItem.to);
    }
  };

  const onOpen = () => {
    setSearchQuery('');
    modalDisclosure.onOpen();
  };

  const results = useMemo(() => {
    let itemIdx = 0;

    return data.map((chapter, cidx) => {
      return (
        <Fragment key={cidx}>
          {/* v2's bare <Divider/> took two things from its baseStyle that v3's
              Separator recipe does not have: `opacity: 0.6` and `borderColor:
              inherit`. v3 paints the line in `colors.border` at full strength
              instead, which is a lighter grey than the text colour this line
              used to inherit. */}
          {cidx > 0 && <Separator opacity={0.6} borderColor="inherit" />}
          <SearchResultSectionTitle
            title={chapter.title}
            idx={itemIdx * -1}
            color="features.search.section.title.color"
            textTransform="none"
            {...(!chapter.icon && {
              mb: 5
            })}
            icon={chapter.icon}
          />
          <VStack
            gap={1}
            w="full"
            textAlign="left"
            _last={{
              mb: 2
            }}
            maxH="205px"
            overflowY="auto"
            className="sd-search-outer-section"
          >
            {chapter.sections.map((section, sidx) => {
              const el = (
                <SearchResultSection
                  section={section}
                  idx={itemIdx}
                  query={searchQuery}
                  key={sidx}
                  defaultHighlight={itemIdx === 0}
                  icon={chapter.icon}
                  isDocs={
                    true
                    // !!section.to?.startsWith('/docs/') ||
                    // !!section.results[0]?.to?.startsWith('/docs/')
                  }
                />
              );

              itemIdx = itemIdx + section.results.length;

              return el;
            })}
          </VStack>
        </Fragment>
      );
    });
  }, [data, navigateIdx]);

  return (
    /**
     * No provider of its own. It used to carry the v2 theme so that the CMS
     * routes, where Layout mounts no site theme, would still resolve the
     * site's tokens.
     *
     * In v3 a provider is also the global-style emitter, so every extra
     * provider re-emits the whole token block. SearchMenu mounts more than
     * once per page (TopNav twice, MobileNavDrawer), and all of those sit
     * inside Layout's provider already. Only the CMS path needs one of its
     * own, so the provider moved to the Toolbar shadow, which is the single
     * mount that renders inside jaen's frame.
     */
    <>
      <SearchButton openModal={onOpen} navigate={handleNavigate} {...props} />
      <SearchModal
        defaultQuery={searchQuery}
        isOpen={modalDisclosure.open}
        onClose={modalDisclosure.onClose}
        isLoading={search.isLoading}
        searchResultItems={results}
        setSearchQuery={setSearchQuery}
        handleNavigate={handleNavigate}
        openActiveItem={handleOpenActiveItem}
      />
    </>
  );
};

export default SearchMenu;

import { sq } from '@/clients/social';
import {
  PageConfig,
  PageProps,
  usePage,
  useField,
  useJaenPageIndex
} from 'jaen';

import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  VStack,
  // keyframes,
  GridProps,
  Container
} from '@chakra-ui/react';
import { graphql } from 'gatsby';
//import * as React from 'react';
import { FC } from 'react';
import { useQuery } from 'snek-query/react-hooks';
import PostCard from '../../components/post/PostCard';
import PostCardSkeleton from '../../components/post/PostCardSkeleton';
import PostList from '../../components/post/PostList';
import RecipesHero from '../../components/sections/RecipesHero';
import { useRecipePages } from '../../hooks/use-recipe-pages';
import { useJaenProducts, IJaenProduct } from '../../hooks/use-products';
import PortfolioGrid from '../../components/sections/Portfolio/PortfolioGrid';
import { ProductCard } from '../../components/ProductCard';
import RezepteIndex from '../../components/RezepteIndex';

export const POST_FETCH_LIMIT = 3;

// const gradientAnimation = keyframes`
//   0%{background-position:0% 50%}
//   50%{background-position:100% 50%}
//   100%{background-position:0% 50%}
// `;

interface INewsSlidesProps {
  productIndex: any;
  showNewsTitle?: boolean;
}

const RecipeSlider: FC<INewsSlidesProps> = ({
  productIndex,
  showNewsTitle
}) => {
  console.log('!!All index data', productIndex);
  const cmsmediapage = usePage({
    id: 'JaenPage /cms/media/',
    injectMedia: true
  });
  //console.log('!!All page data', page)
  //const images = Object.entries(page.jaenFields['IMA:ImageField'])
  //const cmsmedia = useField<any>("media_nodes", 'IMA:MEDIA_NODES').value
  //cmsMediaPage//.jaenPage.jaenFields?.['media_nodes']?.['IMA:MEDIA_NODES']
  console.log('!!All media data', cmsmediapage);
  const { products, featuredProducts, moreProducts, abcProducts } =
    useJaenProducts(productIndex, cmsmediapage);

  console.log('!!All products data', products);
  return (
    <Box as="section">
      {/* <PortfolioGrid
        products={products}
        display={{ base: 'none', sm: 'grid' }}
        mt="16"
      /> */}
      <RezepteIndex
        featuredProducts={featuredProducts}
        abcProducts={abcProducts}
        mt="16"
      />
      {/* Form mobile */}
      {/* <PortfolioSlider index={index} display={{base: 'block', sm: 'none'}} /> */}
    </Box>
  );
};

interface IPortfolioGridProps extends GridProps {
  products: IJaenProduct[];
}

const RecipeGrid: FC<IPortfolioGridProps> = ({ products, ...props }) => {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      }}
      gap={6}
      {...props}
    >
      {products.map((product, index) => {
        console.log('my full index', index);
        console.log('!!!product!!!', product);
        return <ProductCard key={index} product={product} />;
      })}
    </Grid>
  );
};

const RecipeIndexPage: React.FC<PageProps> = () => {
  const { data, isSafe, refetch } = useQuery(sq);
  const productIndex = useRecipePages();

  return (
    <>
      <RecipesHero />
      <Container maxW={'7xl'} my="16">
        <RecipeSlider productIndex={productIndex} />
      </Container>
    </>
  );
};

export default RecipeIndexPage;

export const pageConfig: PageConfig = {
  label: 'Recipes',
  icon: 'FaBook',
  withoutJaenFrameStickyHeader: true,
  childTemplates: ['RecipePage'],
  menu: {
    type: 'app',
    order: 200,
    group: 'photonq'
  }
};

export const query = graphql`
  query ($jaenPageId: String!) {
    jaenPage(id: { eq: $jaenPageId }) {
      ...JaenPageData
      childPages {
        ...JaenPageChildrenData
        sections {
          fieldName
          items {
            id
            jaenFields
          }
        }
      }
    }
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`;

export { Head } from 'jaen';

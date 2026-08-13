import {
  Button,
  ButtonGroup,
  Stack,
  Table,
  Text,
  List
} from '@chakra-ui/react';
import { FC } from 'react';

// Insertable custom components (via Jaen)

import {
  checkUserRoles,
  useAuth,
  useAuthUser,
  useContentManagement,
  usePageContext
} from 'jaen';
import { MdxField, MdxFieldProps } from 'jaen-fields-mdx';
import { EditIcon, SettingsIcon } from '../../components/icons/chakra';
import { Link } from 'gatsby-plugin-jaen';

import Heading from '../docs/heading/components/Heading';
import Callout from '../docs/callout/components/Callouts';
import CodeSnippet from '../docs/code-snippet/components/CodeSnippet';
import DocsIndex from '../docs/docs-index/components/DocsIndex';
import Filesystem from '../docs/filesystem/components/Filesystem';
import IconCard from '../docs/icon-card/components/IconCard';
import ImageCard from '../docs/image-card/components/ImageCard';
import JaenImage from '../JaenImage';

interface IMdxEditorProps {
  hideHeadingHash?: boolean;
  onMdast: (mdast: any) => void;
}

export const mdxEditorComponents: MdxFieldProps['components'] = {
  // TEXT
  p: props => <Text id={props.id} children={props.children} />,
  // LIST
  // v2's UnorderedList and OrderedList were List with `styleType` and
  // `marginStart="1em"` baked in, so a bare List.Root drops the indent every
  // bullet list in the docs had. Spelled out the same way as in
  // docs/list/components/List.tsx.
  ul: (props: any) => (
    <List.Root
      as="ul"
      listStyleType="initial"
      marginStart="1em"
      id={props.id}
      children={props.children}
    ></List.Root>
  ),
  ol: (props: any) => (
    <List.Root
      as="ol"
      listStyleType="decimal"
      marginStart="1em"
      id={props.id}
      children={props.children}
    ></List.Root>
  ),
  li: (props: any) => (
    <List.Item id={props.id} children={props.children}></List.Item>
  ),
  // TABLE
  table: (props: any) => (
    <Table.Root
      id={props.id}
      // v3 turns striped from a variant VALUE into a boolean of its own, so it
      // now stacks on the default line variant instead of replacing it. The
      // site has no table recipe, so the stripe is v3's bg.muted where v2's
      // was tinted by the colour scheme. Restoring that tint is theme work.
      striped
      w="fit-content"
      children={props.children}
    />
  ),
  thead: (props: any) => (
    <Table.Header id={props.id} children={props.children} />
  ),
  tbody: (props: any) => <Table.Body id={props.id} children={props.children} />,
  tr: (props: any) => <Table.Row id={props.id} children={props.children} />,
  th: (props: any) => (
    <Table.ColumnHeader id={props.id} children={props.children} />
  ),
  td: (props: any) => <Table.Cell id={props.id} children={props.children} />,
  // MISC
  img: JaenImage,
  Image: JaenImage,
  // CUSTOM COMPONENTS
  Filesystem,
  ImageCard,
  Callout,
  IconCard,
  DocsIndex
};

const MdxEditor: FC<IMdxEditorProps> = ({ hideHeadingHash, onMdast }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isEditing, toggleIsEditing } = useContentManagement();
  const { jaenPage } = usePageContext();

  const canEdit = isAuthenticated && checkUserRoles(user, ['jaen:admin']);

  return (
    <Stack
      gap={4}
      css={{
        '& .cm-editor': {
          height: '60dvh'
        }
      }}
    >
      {canEdit && isLoading === false && (
        <ButtonGroup>
          <Button
            variant="outline"
            colorPalette={isEditing ? 'red' : undefined}
            onClick={() => toggleIsEditing()}
          >
            <EditIcon />
            {isEditing ? 'Stop Editing' : 'Edit'}
          </Button>

          {/* jaen's Link widens its props to anything, so leftIcon type-checks
              here and then reaches a v3 Button that has no such prop and drops
              the icon on the floor. As a child it renders again. */}
          <Link
            variant="outline"
            as={Button}
            to={`/cms/pages/#${btoa(jaenPage.id)}`}
          >
            <SettingsIcon />
            Page Settings
          </Link>
        </ButtonGroup>
      )}

      <div>
        <MdxField
          key={jaenPage.id}
          name="documentation"
          components={{
            // TEXT
            h1: props => (
              <Heading variant="h1" {...props} noAnchor={hideHeadingHash} />
            ),
            h2: props => (
              <Heading variant="h2" {...props} noAnchor={hideHeadingHash} />
            ),
            h3: props => (
              <Heading variant="h3" {...props} noAnchor={hideHeadingHash} />
            ),
            h4: props => (
              <Heading variant="h4" {...props} noAnchor={hideHeadingHash} />
            ),
            h5: props => (
              <Heading variant="h5" {...props} noAnchor={hideHeadingHash} />
            ),
            h6: props => (
              <Heading variant="h6" {...props} noAnchor={hideHeadingHash} />
            ),
            wrapper: ({ children }) => <Stack>{children}</Stack>,
            ...mdxEditorComponents
          }}
          onMdast={onMdast}
        />
      </div>
    </Stack>
  );
};

export default MdxEditor;

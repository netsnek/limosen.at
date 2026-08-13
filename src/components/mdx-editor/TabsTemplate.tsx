import { AddIcon } from '../../components/icons/chakra';
import { Box, Button, Menu, Spacer, Tabs, Portal } from '@chakra-ui/react';
import React, { useState } from 'react';

interface ComponentInfoProps {
  items: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export const ComponentInfo: React.FC<ComponentInfoProps> = ({ items }) => (
  <Menu.Root>
    {/* <MenuButton
      as={Button}
      leftIcon={<AddIcon />}
      size="sm"
      variant="link"
      mx="2">
      Components
    </MenuButton> */}

    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          {/* The value is the item's DOM id in v3 (zag composes
              `${menuId}/${value}` and resolves the select listener with
              getElementById), so the codemod's literal "item-0" gave every
              entry the same id and only the first one could be picked. The
              label is already the React key and is unique per menu. */}
          {items.map(item => (
            <Menu.Item
              key={item.label}
              onSelect={item.onClick}
              value={item.label}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
);

export interface TabsProps {
  tabs: Array<{
    label: React.ReactNode;
    content: React.ReactNode;
  }>;
  selectedTab: number;
  componentsInfo?: ComponentInfoProps['items'];
}

const TabsTemplate: React.FC<TabsProps> = props => {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <Box position="relative">
      {/* v3 addresses tabs by string value where v2 addressed them by index.
          The index is what this component's props, state and the editor that
          mounts it all speak, so the position is stringified at the boundary
          and nothing outside this file has to learn the new spelling. */}
      <Tabs.Root
        value={String(selectedTab)}
        onValueChange={({ value }) => handleTabChange(Number(value))}
        pos="relative"
        size="sm"
      >
        <Tabs.List pos="sticky" top="0" zIndex="1">
          {props.tabs.map((tab, i) => (
            <Tabs.Trigger key={i} value={String(i)}>
              {tab.label}
            </Tabs.Trigger>
          ))}
          <Spacer />
          <ComponentInfo items={props.componentsInfo || []} />
        </Tabs.List>

        <Tabs.ContentGroup>
          {props.tabs.map((tab, i) => (
            <Tabs.Content key={i} value={String(i)} p="0">
              {tab.content}
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Box>
  );
};

export default TabsTemplate;

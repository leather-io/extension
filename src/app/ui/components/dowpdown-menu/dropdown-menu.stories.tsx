import type { Meta, StoryObj } from '@storybook/react';
import { HStack, styled } from 'leather-styles/jsx';

import { ChevronDownIcon } from '../icons/chevron-down-icon';
import { PlaceholderIcon } from '../icons/placeholder-icon';
import { DropdownMenu as Component, DropdownMenuItem } from './dropdown-menu';
import { DropdownMenuItemLayout } from './dropdown-menu-item.layout';

const items: DropdownMenuItem[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Dropdown Menu',
};

export default meta;
type Story = StoryObj<typeof Component.Root>;

export const DropdownMenu: Story = {
  render: () => (
    <Component.Root>
      <Component.Trigger>
        <styled.button>
          <HStack gap="space.02" width="100%">
            <styled.span textStyle="label.02">Options</styled.span>
            <ChevronDownIcon />
          </HStack>
        </styled.button>
      </Component.Trigger>
      <Component.Portal>
        <Component.Content align="start" sideOffset={8}>
          <Component.Group>
            <Component.Label>Label</Component.Label>
            {items.map(item => (
              <Component.Item key={item.label}>
                <DropdownMenuItemLayout
                  contentLeft={
                    <HStack gap="space.02" minHeight="24px">
                      <PlaceholderIcon />
                      <styled.span textStyle="label.02">{item.label}</styled.span>
                    </HStack>
                  }
                  contentRight={<PlaceholderIcon />}
                />
              </Component.Item>
            ))}
          </Component.Group>
        </Component.Content>
      </Component.Portal>
    </Component.Root>
  ),
};

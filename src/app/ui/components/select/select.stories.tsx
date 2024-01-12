import type { Meta, StoryObj } from '@storybook/react';
import { HStack, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '../icons/checkmark-icon';
import { ChevronDownIcon } from '../icons/chevron-down-icon';
import { PlaceholderIcon } from '../icons/placeholder-icon';
import { Select as Component, SelectItem } from './select';
import { SelectItemLayout } from './select-item.layout';

const items: SelectItem[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Select',
};

export default meta;
type Story = StoryObj<typeof Component.Root>;

export const Select: Story = {
  render: () => (
    <Component.Root>
      <Component.Trigger>
        <Component.Value placeholder="Options" />
        <Component.Icon>
          <ChevronDownIcon />
        </Component.Icon>
      </Component.Trigger>
      <Component.Portal>
        <Component.Content align="start" position="popper" sideOffset={8}>
          <Component.Viewport>
            <Component.Group>
              <Component.Label>Label</Component.Label>
              {items.map(item => (
                <Component.Item key={item.label} value={item.label}>
                  <SelectItemLayout
                    contentLeft={
                      <HStack display="flex" gap="space.02" width="100%">
                        <PlaceholderIcon />
                        <Component.ItemText>
                          <styled.span textStyle="label.02">{item.label}</styled.span>
                        </Component.ItemText>
                        <Component.ItemIndicator>
                          <CheckmarkIcon />
                        </Component.ItemIndicator>
                      </HStack>
                    }
                    contentRight={<PlaceholderIcon />}
                  />
                </Component.Item>
              ))}
            </Component.Group>
          </Component.Viewport>
        </Component.Content>
      </Component.Portal>
    </Component.Root>
  ),
};

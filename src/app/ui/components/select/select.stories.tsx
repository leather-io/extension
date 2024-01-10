import * as RadixSelect from '@radix-ui/react-select';
import type { Meta, StoryObj } from '@storybook/react';

import { ListItemType } from '../list/list-item';
import { Select as Component } from './select';
import { SelectItem } from './select-item';
import { SelectSectionLabel } from './select-section-label';

const items: ListItemType[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Select',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Select: Story = {
  render: () => (
    <Component>
      <RadixSelect.Group>
        <SelectSectionLabel label="Items" />
        {items.map(item => {
          return (
            <SelectItem
              key={item.label}
              iconLeft={item.iconLeft}
              iconRight={item.iconRight}
              label={item.label}
            />
          );
        })}
      </RadixSelect.Group>
    </Component>
  ),
};

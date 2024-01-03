import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Meta, StoryObj } from '@storybook/react';

import { ListItemType } from '../list/list-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownMenuItem } from './dropdown-menu-item';
import { DropdownMenuSectionLabel } from './dropdown-menu-section-label';

const items: ListItemType[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  tags: ['autodocs'],
  title: 'Dropdown Menu',
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Primary: Story = {
  render: () => (
    <DropdownMenu>
      <RadixDropdownMenu.Group>
        <DropdownMenuSectionLabel label="Items" />
        {items.map(item => {
          return (
            <DropdownMenuItem
              key={item.label}
              iconLeft={item.iconLeft}
              iconRight={item.iconRight}
              label={item.label}
            />
          );
        })}
      </RadixDropdownMenu.Group>
    </DropdownMenu>
  ),
};

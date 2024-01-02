import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

import { ListItemType } from '../list/list-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownMenuItem } from './dropdown-menu-item';
import { DropdownMenuSectionLabel } from './dropdown-menu-section-label';

const items: ListItemType[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

// Example implementation - remove with Storybook
// ts-unused-exports:disable-next-line
export function DropdownMenuExample() {
  return (
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
  );
}

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

import { ListItem, ListItemType } from '../list/list-item';
import { listItemStyles } from '../list/list.styles';

type DropdownMenuItemProps = ListItemType;

export function DropdownMenuItem({ iconLeft, iconRight, label }: DropdownMenuItemProps) {
  return (
    <RadixDropdownMenu.Item className={listItemStyles}>
      <ListItem iconLeft={iconLeft} iconRight={iconRight} label={label} />
    </RadixDropdownMenu.Item>
  );
}

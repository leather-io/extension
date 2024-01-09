import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

import { ListSectionLabel } from '../list/list-section-label';
import { listSectionLabelStyles } from '../list/list.styles';

interface DropdownMenuSectionLabelProps {
  label: string;
}
export function DropdownMenuSectionLabel({ label }: DropdownMenuSectionLabelProps) {
  return (
    <RadixDropdownMenu.Label className={listSectionLabelStyles}>
      <ListSectionLabel label={label} />
    </RadixDropdownMenu.Label>
  );
}

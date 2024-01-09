import * as RadixSelect from '@radix-ui/react-select';

import { ListItemType } from '../list/list-item';
import { Select } from './select';
import { SelectItem } from './select-item';
import { SelectSectionLabel } from './select-section-label';

const items: ListItemType[] = [{ label: 'Label 1' }, { label: 'Label 2' }];

// Example implementation - remove with Storybook
// ts-unused-exports:disable-next-line
export function SelectExample() {
  return (
    <Select>
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
    </Select>
  );
}

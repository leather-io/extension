import * as RadixSelect from '@radix-ui/react-select';

import { ListSectionLabel } from '../list/list-section-label';
import { listSectionLabelStyles } from '../list/list.styles';

interface SelectSectionLabelProps {
  label: string;
}
export function SelectSectionLabel({ label }: SelectSectionLabelProps) {
  return (
    <RadixSelect.Label className={listSectionLabelStyles}>
      <ListSectionLabel label={label} />
    </RadixSelect.Label>
  );
}

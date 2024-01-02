import * as RadixSelect from '@radix-ui/react-select';
import { css } from 'leather-styles/css';

import { defaultTriggerStyles } from '@app/ui/components/list/list.styles';

import { ChevronDownIcon } from '../icons/chevron-down-icon';

const selectTriggerStyles = css({ alignItems: 'center', display: 'flex', gap: 'space.02' });

interface SelectTriggerProps {
  placeholder?: string;
}
export function SelectTrigger({ placeholder = 'Options' }: SelectTriggerProps) {
  return (
    <RadixSelect.Trigger className={`${defaultTriggerStyles} ${selectTriggerStyles}`}>
      <RadixSelect.Value placeholder={placeholder} />
      <RadixSelect.Icon>
        <ChevronDownIcon />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

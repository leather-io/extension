import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { HStack, styled } from 'leather-styles/jsx';

import { defaultTriggerStyles } from '@app/ui/components/list/list.styles';

import { ChevronDownIcon } from '../icons/chevron-down-icon';

interface DropdownMenuTriggerProps {
  placeholder?: string;
}
export function DropdownMenuTrigger({ placeholder = 'Options' }: DropdownMenuTriggerProps) {
  return (
    <RadixDropdownMenu.Trigger className={defaultTriggerStyles}>
      <styled.button>
        <HStack gap="space.02" width="100%">
          <styled.span textStyle="label.02">{placeholder}</styled.span>
          <ChevronDownIcon />
        </HStack>
      </styled.button>
    </RadixDropdownMenu.Trigger>
  );
}

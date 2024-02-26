import type { ComponentProps } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { ChevronDownIcon } from '@app/ui/icons/chevron-down-icon';

const labels = ['Address', 'BNS Name'];
const testLabels = ['address', 'bns-name'];

interface RecipientDropdownItemProps extends ComponentProps<typeof styled.button> {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}
export function RecipientDropdownItem({
  index,
  isVisible,
  onSelectItem,
}: RecipientDropdownItemProps) {
  return (
    <styled.button
      display="flex"
      pos="relative"
      type="button"
      color="accent.text-primary"
      _hover={{
        bg: isVisible ? 'ink.component-background-hover' : 'ink.background-primary',
        borderRadius: 'xs',
        color: 'ink.text-primary',
      }}
      alignItems="center"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      onClick={() => onSelectItem(index)}
      zIndex={20}
      pl={isVisible ? 'space.02' : 'unset'}
    >
      <HStack gap="space.01">
        <styled.span textStyle="label.03">{labels[index]}</styled.span>
        {isVisible ? <></> : <ChevronDownIcon variant="small" />}
      </HStack>
    </styled.button>
  );
}

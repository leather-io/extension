import { useMemo } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';

const labels = ['Low', 'Standard', 'High', 'Custom'];
const testLabels = labels.map(label => label.toLowerCase());

interface FeeEstimateItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
  selectedItem: number;
  disableFeeSelection?: boolean;
}
export function FeeEstimateItem({
  index,
  isVisible,
  onSelectItem,
  selectedItem,
  disableFeeSelection,
}: FeeEstimateItemProps) {
  const selectedIcon = useMemo(() => {
    const isSelected = index === selectedItem;
    return isSelected ? <CheckmarkIcon /> : <></>;
  }, [index, selectedItem]);

  return (
    <HStack
      _hover={{
        bg: isVisible ? 'accent.component-background-hover' : 'accent.background-primary',
        borderRadius: '8px',
      }}
      alignItems="center"
      data-testid={`${testLabels[index]}-fee`}
      height="32px"
      minWidth="100px"
      p="tight"
    >
      <styled.button
        onClick={() => !disableFeeSelection && onSelectItem(index)}
        type="button"
        width="100%"
      >
        <HStack gap="space.01">
          <styled.span textStyle="label.02">{labels[index]}</styled.span>
          {!disableFeeSelection && (isVisible ? selectedIcon : <ChevronDownIcon />)}
        </HStack>
      </styled.button>
    </HStack>
  );
}

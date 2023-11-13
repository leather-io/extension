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
    return isSelected ? <CheckmarkIcon color="accent.background-primary" size="14px" /> : <></>;
  }, [index, selectedItem]);

  return (
    <HStack
      alignItems="center"
      data-testid={`${testLabels[index]}-fee`}
      //  #4476 TODO test this hover works and that removing isVisble + !imprtant
      _hover={{ bg: 'accent.component-background-hover', borderRadius: '8px' }}
      height="32px"
      minWidth="100px"
      onClick={() => !disableFeeSelection && onSelectItem(index)}
      p="tight"
    >
      <styled.span fontSize={1} fontWeight={500} ml="2px">
        {labels[index]}
      </styled.span>
      {!disableFeeSelection && (isVisible ? selectedIcon : <ChevronDownIcon />)}
    </HStack>
  );
}

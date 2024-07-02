import { useMemo } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { CheckmarkIcon, ChevronDownIcon, Link } from '@leather.io/ui';

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
    return isSelected ? <CheckmarkIcon variant="small" /> : <></>;
  }, [index, selectedItem]);

  return (
    <Link
      _before={{ bg: 'transparent' }}
      _hover={{
        bg: isVisible ? 'ink.component-background-hover' : 'ink.background-primary',
        borderRadius: 'xs',
        color: 'ink.text-primary',
      }}
      alignItems="center"
      data-testid={`${testLabels[index]}-fee`}
      display="flex"
      height="30px"
      minWidth="100px"
      onClick={() => !disableFeeSelection && onSelectItem(index)}
      pl={isVisible ? 'space.02' : 'unset'}
      variant="text"
    >
      <HStack gap="space.01">
        <styled.span textStyle="label.02">{labels[index]}</styled.span>
        {!disableFeeSelection && (isVisible ? selectedIcon : <ChevronDownIcon variant="small" />)}
      </HStack>
    </Link>
  );
}

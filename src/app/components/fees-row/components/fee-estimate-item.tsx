import { useMemo } from 'react';
import { FiCheck } from 'react-icons/fi';

import { HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';

const labels = ['Low', 'Standard', 'High', 'Custom'];
const testLabels = labels.map(label => label.toLowerCase());

interface FeeEstimateItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
  selectedItem: number;
}
export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { index, isVisible, onSelectItem, selectedItem } = props;

  const selectedIcon = useMemo(() => {
    const isSelected = index === selectedItem;
    return isSelected ? <FiCheck size="14px" /> : <></>;
  }, [index, selectedItem]);

  return (
    <HStack
      alignItems="center"
      data-testid={`${testLabels[index]}-fee`}
      _hover={{
        bg: isVisible ? token('colors.accent.background-secondary') : 'none',
        borderRadius: '8px',
      }}
      height="32px"
      mb="0px !important"
      minWidth="100px"
      onClick={() => onSelectItem(index)}
      p="space.02"
    >
      <styled.span fontSize={1} fontWeight={500} ml="2px">
        {labels[index]}
      </styled.span>
      {isVisible ? selectedIcon : <ChevronDownIcon />}
    </HStack>
  );
}

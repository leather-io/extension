import { useMemo } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

import { Stack, Text, color } from '@stacks/ui';

const labels = ['Low', 'Standard', 'High', 'Custom'];
const testLabels = labels.map(label => label.toLowerCase());

interface FeeEstimateItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
  selectedItem: number;
  disableFeeSelection?: boolean;
}
export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { index, isVisible, onSelectItem, selectedItem, disableFeeSelection } = props;

  const selectedIcon = useMemo(() => {
    const isSelected = index === selectedItem;
    return isSelected ? <FiCheck color={color('accent')} size="14px" /> : <></>;
  }, [index, selectedItem]);

  return (
    <Stack
      alignItems="center"
      data-testid={`${testLabels[index]}-fee`}
      _hover={{ bg: isVisible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      mb="0px !important"
      minWidth="100px"
      onClick={() => !disableFeeSelection && onSelectItem(index)}
      p="tight"
    >
      <Text fontSize={1} fontWeight={500} ml="2px">
        {labels[index]}
      </Text>
      {!disableFeeSelection && (isVisible ? selectedIcon : <FiChevronDown />)}
    </Stack>
  );
}

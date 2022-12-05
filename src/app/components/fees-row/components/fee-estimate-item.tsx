import { useMemo } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

import { Stack, color } from '@stacks/ui';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

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
    return isSelected ? <FiCheck color={color('accent')} size="14px" /> : <></>;
  }, [index, selectedItem]);

  return (
    <Stack
      alignItems="center"
      border={isVisible ? 'none' : '1px solid #EFEFF2'}
      borderRadius={isVisible ? '0px' : '10px'}
      bg={color('bg')}
      data-testid={`${testLabels[index]}-fee`}
      _hover={{ bg: isVisible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      mb="0px !important"
      minWidth="100px"
      onClick={() => onSelectItem(index)}
      p="tight"
    >
      <SpaceBetween flexGrow={1}>
        <Caption ml="2px">{labels[index]}</Caption>
        {isVisible ? selectedIcon : <FiChevronDown />}
      </SpaceBetween>
    </Stack>
  );
}

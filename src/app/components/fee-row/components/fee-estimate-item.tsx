import { useCallback } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

import { Stack, color } from '@stacks/ui';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

const labels = ['Low', 'Standard', 'High', 'Custom'];
const testLabels = labels.map(label => label.toLowerCase());

interface FeeEstimateItemProps {
  index: number;
  onClick: (index: number) => void;
  selected?: number;
  visible?: boolean;
}
export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { index, onClick, selected, visible } = props;

  const selectedIcon = useCallback(() => {
    const isSelected = index === selected;
    return isSelected ? <FiCheck color={color('accent')} size="14px" /> : <></>;
  }, [index, selected]);

  return (
    <Stack
      alignItems="center"
      border={visible ? 'none' : '1px solid #EFEFF2'}
      borderRadius={visible ? '0px' : '10px'}
      bg={color('bg')}
      data-testid={`${testLabels[index]}-fee`}
      _hover={{ bg: visible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      minWidth="100px"
      p="tight"
      mb="0px !important"
      onClick={() => onClick(index)}
    >
      <SpaceBetween flexGrow={1}>
        <Caption ml="2px">{labels[index]}</Caption>
        {visible ? selectedIcon() : <FiChevronDown />}
      </SpaceBetween>
    </Stack>
  );
}

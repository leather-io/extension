import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { color, Stack } from '@stacks/ui';

import { Caption } from '@components/typography';

interface FeeEstimateItemProps {
  hasFeeEstimations?: boolean | null;
  index: number;
  isSelectActive?: boolean | null;
  label: string;
  onClick?: (index: number) => void | undefined;
  selected?: number;
}

export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { hasFeeEstimations, index, isSelectActive, label, onClick } = props;

  return (
    <Stack
      alignItems="center"
      border={isSelectActive ? 'none' : '1px solid #EFEFF2'}
      borderRadius={isSelectActive ? '0px' : '10px'}
      bg={color('bg')}
      _hover={{ bg: isSelectActive ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      minWidth="100px"
      p="tight"
      mb="0px !important"
      onClick={() => onClick?.(index)}
    >
      <Stack alignItems="center" isInline flexGrow={1}>
        <Caption ml="2px">{label}</Caption>
      </Stack>
      <Stack textAlign="right">
        {isSelectActive || !hasFeeEstimations ? <></> : <FiChevronDown />}
      </Stack>
    </Stack>
  );
}

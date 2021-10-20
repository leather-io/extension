import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { color, Stack } from '@stacks/ui';

import { Caption } from '@components/typography';

const LABELS = ['Low', 'Standard', 'High', 'Custom'];

interface FeeEstimateItemProps {
  hasFeeEstimations?: boolean | null;
  index: number;
  onClick?: (index: number) => void | undefined;
  selected?: number;
  visible?: boolean;
}

export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { hasFeeEstimations, index, onClick, visible } = props;

  return (
    <Stack
      alignItems="center"
      border={visible ? 'none' : '1px solid #EFEFF2'}
      borderRadius={visible ? '0px' : '10px'}
      bg={color('bg')}
      _hover={{ bg: visible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      minWidth="100px"
      p="tight"
      mb="0px !important"
      onClick={() => onClick?.(index)}
    >
      <Stack alignItems="center" isInline flexGrow={1}>
        <Caption ml="2px">{LABELS[index]}</Caption>
      </Stack>
      <Stack textAlign="right">{visible || !hasFeeEstimations ? <></> : <FiChevronDown />}</Stack>
    </Stack>
  );
}

import { FiCornerDownRight } from 'react-icons/fi';

import { Box } from '@stacks/ui';
import { color } from '@stacks/ui-utils';

import type { Money } from '@shared/models/money.model';

import { ftDecimals } from '@app/common/stacks-utils';
import { Text } from '@app/components/typography';

interface SubBalanceProps {
  balance: Money;
}
export function SubBalance({ balance }: SubBalanceProps) {
  return (
    <Text
      color={color('text-caption')}
      fontVariantNumeric="tabular-nums"
      textAlign="right"
      fontSize="12px"
    >
      <Box
        as={FiCornerDownRight}
        strokeWidth={2}
        style={{ display: 'inline-block', paddingRight: '2px' }}
      />
      {ftDecimals(balance.amount, balance.decimals)}
    </Text>
  );
}

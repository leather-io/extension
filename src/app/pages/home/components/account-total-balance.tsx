import { memo } from 'react';

import { Text } from '@stacks/ui';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

export const AccountTotalBalance = memo(() => {
  const totalBalance = useTotalBalance();

  if (!totalBalance) return null;

  return (
    <Text fontSize="14px" color="#777E88">
      {totalBalance.totalUsdBalance}
    </Text>
  );
});

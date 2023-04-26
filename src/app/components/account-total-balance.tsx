import { memo } from 'react';

import { Text } from '@stacks/ui';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}

export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const totalBalance = useTotalBalance({ btcAddress, stxAddress });

  if (!totalBalance) return null;

  return (
    <Text fontSize="14px" color="#777E88">
      {totalBalance.totalUsdBalance}
    </Text>
  );
});

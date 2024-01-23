import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}
export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const totalBalance = useTotalBalance({ btcAddress, stxAddress });

  if (!totalBalance) return null;

  return (
    <styled.span fontWeight={500} textStyle="label.02">
      {totalBalance.totalUsdBalance}
    </styled.span>
  );
});

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

  return <styled.span textStyle="label.01">{totalBalance.totalUsdBalance}</styled.span>;
});

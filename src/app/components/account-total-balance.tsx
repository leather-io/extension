import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

import { shimmerStyles } from '../../../theme/global/shimmer-styles';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}
export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const { totalUsdBalance, isLoading } = useTotalBalance({ btcAddress, stxAddress });

  if (!totalUsdBalance) return null;

  return (
    <styled.span
      fontWeight={500}
      textStyle="label.02"
      data-state={isLoading ? 'loading' : undefined}
      className={shimmerStyles}
    >
      {totalUsdBalance}
    </styled.span>
  );
});

import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { SkeletonLoader, shimmerStyles } from '@leather-wallet/ui';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}

export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const { totalUsdBalance, isFetching, isInitialLoading } = useTotalBalance({
    btcAddress,
    stxAddress,
  });

  if (!totalUsdBalance) return null;

  return (
    <SkeletonLoader height="20px" isLoading={isInitialLoading}>
      <styled.span
        className={shimmerStyles}
        textStyle="label.02"
        data-state={isFetching ? 'loading' : undefined}
      >
        {totalUsdBalance}
      </styled.span>
    </SkeletonLoader>
  );
});

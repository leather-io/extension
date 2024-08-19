import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { SkeletonLoader, shimmerStyles } from '@leather.io/ui';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}

export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const { totalUsdBalance, isFetching, isLoading, isLoadingAdditionalData } = useTotalBalance({
    btcAddress,
    stxAddress,
  });

  if (!totalUsdBalance) return null;

  return (
    <SkeletonLoader height="20px" isLoading={isLoading}>
      <styled.span
        className={shimmerStyles}
        textStyle="label.02"
        data-state={isLoadingAdditionalData || isFetching ? 'loading' : undefined}
      >
        {totalUsdBalance}
      </styled.span>
    </SkeletonLoader>
  );
});

import { memo } from 'react';

import { css } from 'leather-styles/css';
import { styled } from 'leather-styles/jsx';

import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';

import { SkeletonLoader } from '../ui/components/skeleton-loader/skeleton-loader';
import { shimmerStyles } from '../ui/shared/shimmer-styles';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}

export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const { totalUsdBalance, isLoading, isInitialLoading } = useTotalBalance({
    btcAddress,
    stxAddress,
  });

  if (!totalUsdBalance) return null;

  return (
    <SkeletonLoader height="20px" isLoading={isInitialLoading}>
      <styled.span
        className={css(shimmerStyles)}
        textStyle="label.02"
        data-state={isLoading ? 'loading' : undefined}
      >
        {totalUsdBalance}
      </styled.span>
    </SkeletonLoader>
  );
});

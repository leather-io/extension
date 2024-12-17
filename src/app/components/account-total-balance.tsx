import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { SkeletonLoader, shimmerStyles } from '@leather.io/ui';

import { useBalances } from '@app/common/hooks/balance/use-balances';
import { PrivateText } from '@app/components/privacy/private-text';

interface AccountTotalBalanceProps {
  btcAddress: string;
  stxAddress: string;
}

export const AccountTotalBalance = memo(({ btcAddress, stxAddress }: AccountTotalBalanceProps) => {
  const { totalUsdBalance, isFetching, isLoading, isLoadingAdditionalData } = useBalances({
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
        <PrivateText>{totalUsdBalance}</PrivateText>
      </styled.span>
    </SkeletonLoader>
  );
});

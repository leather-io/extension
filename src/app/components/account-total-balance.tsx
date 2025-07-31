import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { SkeletonLoader, shimmerStyles } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { PrivateText } from '@app/components/privacy/private-text';
import { useAccountBalance } from '@app/query/common/account-balance/account-balance.hooks';

interface AccountTotalBalanceProps {
  accountIndex: number;
}

export const AccountTotalBalance = memo(({ accountIndex }: AccountTotalBalanceProps) => {
  const { totalBalance, isLoading, isLoadingAdditionalData } = useAccountBalance(accountIndex);

  if (!totalBalance) return null;

  return (
    <SkeletonLoader height="20px" isLoading={isLoading}>
      <styled.span
        className={shimmerStyles}
        textStyle="label.02"
        data-state={isLoadingAdditionalData ? 'loading' : undefined}
      >
        <PrivateText>{formatCurrency(totalBalance)}</PrivateText>
      </styled.span>
    </SkeletonLoader>
  );
});

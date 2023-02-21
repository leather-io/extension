import { memo } from 'react';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import {
  AccountBalanceCaption,
  AccountBalanceLoading,
} from '@app/components/account/account-balance-caption';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/balance.hooks';

interface AccountBalanceLabelProps {
  address: string;
  currency?: CryptoCurrencies;
}
export const AccountBalanceLabel = memo(
  ({ address, currency = 'STX' }: AccountBalanceLabelProps) => {
    const marketData = useCryptoCurrencyMarketData(currency);
    const { data: balances, isLoading } = useAnchoredStacksAccountBalances(address);

    if (isLoading) return <AccountBalanceLoading />;

    if (!balances) return null;

    return (
      <AccountBalanceCaption availableBalance={balances.stx.availableStx} marketData={marketData} />
    );
  }
);

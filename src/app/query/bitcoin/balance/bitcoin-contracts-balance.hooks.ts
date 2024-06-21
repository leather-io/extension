import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { useCalculateBitcoinFiatValue } from '@leather.io/query';
import { createMoney, i18nFormatCurrency, isUndefined } from '@leather.io/utils';

import { useBitcoinContractsBalanceQuery } from './bitcoin-contracts-balance.query';

export function useGetBitcoinContractsBalance() {
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const { data: bitcoinContractsBalance, isLoading } = useBitcoinContractsBalanceQuery();

  return useMemo(() => {
    if (isUndefined(bitcoinContractsBalance))
      return {
        bitcoinContractsBalance: createMoney(new BigNumber(0), 'BTC'),
        bitcoinContractsBalanceInUSD: i18nFormatCurrency(createMoney(new BigNumber(0), 'USD')),
        isLoading,
      };
    return {
      bitcoinContractsBalance,
      bitcoinContractsBalanceInUSD: i18nFormatCurrency(
        calculateFiatValue(createMoney(bitcoinContractsBalance.amount, 'BTC'))
      ),
      isLoading,
    };
  }, [bitcoinContractsBalance, isLoading, calculateFiatValue]);
}

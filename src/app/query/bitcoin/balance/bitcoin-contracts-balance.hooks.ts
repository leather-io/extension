import { useMemo } from 'react';

import { useCalculateBitcoinFiatValue } from '@leather-wallet/query';
import { isUndefined } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import { i18nFormatCurrency } from '@app/common/money/format-money';

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

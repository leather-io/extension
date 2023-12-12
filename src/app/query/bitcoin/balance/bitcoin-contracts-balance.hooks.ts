import { useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { useBitcoinContractsBalanceQuery } from './bitcoin-contracts-balance.query';

export function useGetBitcoinContractsBalance() {
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const { data: bitcoinContractsBalance, isLoading } = useBitcoinContractsBalanceQuery();
  const [bitcoinContractsBalanceInUSD, setBitcoinContractsBalanceInUSD] = useState<string>('0');

  useEffect(() => {
    if (isUndefined(bitcoinContractsBalance)) return;
    setBitcoinContractsBalanceInUSD(
      i18nFormatCurrency(calculateFiatValue(createMoney(bitcoinContractsBalance.amount, 'BTC')))
    );
  }, [bitcoinContractsBalance, calculateFiatValue]);

  return useMemo(() => {
    if (isUndefined(bitcoinContractsBalance))
      return {
        bitcoinContractsBalance: createMoney(new BigNumber(0), 'BTC'),
        bitcoinContractsBalanceInUSD: i18nFormatCurrency(createMoney(new BigNumber(0), 'USD')),
        isLoading,
      };
    return {
      bitcoinContractsBalance,
      bitcoinContractsBalanceInUSD: bitcoinContractsBalanceInUSD,
      isLoading,
    };
  }, [bitcoinContractsBalance, bitcoinContractsBalanceInUSD, isLoading]);
}

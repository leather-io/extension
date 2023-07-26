import { useCallback } from 'react';

import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useSpendableCurrentNativeSegwitAccountUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

export const MAX_FEE_RATE_MULTIPLIER = 50;

interface UseBitcoinCustomFeeArgs {
  amount: number;
  isSendingMax: boolean;
  recipient: string;
}
export function useBitcoinCustomFee({ amount, isSendingMax, recipient }: UseBitcoinCustomFeeArgs) {
  const balance = useCurrentNativeSegwitAddressBalance();
  const { data: utxos = [] } = useSpendableCurrentNativeSegwitAccountUtxos();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  return useCallback(
    (feeRate: number) => {
      if (!feeRate || !utxos.length) return { fee: 0, fiatFeeValue: '' };

      const satAmount = isSendingMax ? balance.amount.toNumber() : amount;

      const determineUtxosArgs = {
        amount: satAmount,
        recipient,
        utxos,
        feeRate,
      };
      const { fee } = isSendingMax
        ? determineUtxosForSpendAll(determineUtxosArgs)
        : determineUtxosForSpend(determineUtxosArgs);

      return {
        fee,
        fiatFeeValue: `~ ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
        )}`,
      };
    },
    [utxos, isSendingMax, balance.amount, amount, recipient, btcMarketData]
  );
}

import { useCallback } from 'react';

import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useSpendableCurrentNativeSegwitAccountUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

interface UseBitcoinCustomFeeArgs {
  recipient: string;
  amount: number;
}

export function useBitcoinCustomFee({ recipient, amount }: UseBitcoinCustomFeeArgs) {
  const { data: utxos = [] } = useSpendableCurrentNativeSegwitAccountUtxos();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  return useCallback(
    (feeRate: number) => {
      if (!feeRate || !utxos.length) return { fee: 0, fiatFeeValue: '' };

      const determineUtxosArgs = {
        amount,
        recipient,
        utxos,
        feeRate,
      };
      const { fee } = determineUtxosForSpend(determineUtxosArgs);

      return {
        fee,
        fiatFeeValue: `~ ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
        )}`,
      };
    },
    [btcMarketData, amount, recipient, utxos]
  );
}

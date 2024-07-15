import { useCallback } from 'react';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { baseCurrencyAmountInQuote, createMoney, i18nFormatCurrency } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import {
  type DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

export const MAX_FEE_RATE_MULTIPLIER = 50;

interface UseBitcoinCustomFeeArgs {
  isSendingMax: boolean;
  recipients: TransferRecipient[];
}

export function useBitcoinCustomFee({ isSendingMax, recipients }: UseBitcoinCustomFeeArgs) {
  const { data: utxos = [] } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return useCallback(
    (feeRate: number) => {
      if (!feeRate || !utxos.length) return { fee: 0, fiatFeeValue: '' };

      const determineUtxosArgs: DetermineUtxosForSpendArgs = {
        recipients,
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
    [utxos, isSendingMax, recipients, btcMarketData]
  );
}

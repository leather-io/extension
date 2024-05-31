import { useCallback } from 'react';

import type { Money } from '@leather-wallet/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';
import { baseCurrencyAmountInQuote, createMoney, i18nFormatCurrency } from '@leather-wallet/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

export const MAX_FEE_RATE_MULTIPLIER = 50;

interface UseBitcoinCustomFeeArgs {
  amount: Money;
  isSendingMax: boolean;
  recipients: TransferRecipient[];
}

export function useBitcoinCustomFee({ amount, isSendingMax, recipients }: UseBitcoinCustomFeeArgs) {
  const { balance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const { data: utxos = [] } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return useCallback(
    (feeRate: number) => {
      if (!feeRate || !utxos.length) return { fee: 0, fiatFeeValue: '' };

      const satAmount = isSendingMax
        ? balance.availableBalance.amount.toNumber()
        : amount.amount.toNumber();

      const determineUtxosArgs = {
        amount: satAmount,
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
    [utxos, isSendingMax, balance.availableBalance.amount, amount.amount, recipients, btcMarketData]
  );
}

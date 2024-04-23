import { useMemo } from 'react';

import { BtcFeeType, btcTxTimeMap } from '@shared/models/fees/bitcoin-fees.model';
import { Money, createMoney } from '@shared/models/money.model';
import type { RpcSendTransferRecipient } from '@shared/rpc/methods/send-transfer';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import {
  type DetermineUtxosForSpendArgsMultipleRecipients,
  determineUtxosForSpendAllMultipleRecipients,
  determineUtxosForSpendMultipleRecipients,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

import { FeesListItem } from './bitcoin-fees-list';

function getFeeForList(
  determineUtxosForFeeArgs: DetermineUtxosForSpendArgsMultipleRecipients,
  isSendingMax?: boolean
) {
  try {
    const { estimatedFee } = isSendingMax
      ? determineUtxosForSpendAllMultipleRecipients(determineUtxosForFeeArgs)
      : determineUtxosForSpendMultipleRecipients(determineUtxosForFeeArgs);
    return estimatedFee;
  } catch (error) {
    return null;
  }
}

interface UseBitcoinFeesListArgs {
  amount: Money;
  recipients: RpcSendTransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function useBitcoinFeesListMultipleRecipients({
  amount,
  recipients,
  utxos,
}: UseBitcoinFeesListArgs) {
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    if (!feeRates || !utxos.length) return [];

    const satAmount = amount.amount.toNumber();

    const determineUtxosDefaultArgs = {
      amount: satAmount,
      recipients,
      utxos,
    };

    const determineUtxosForHighFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.fastestFee.toNumber(),
    };

    const determineUtxosForStandardFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.halfHourFee.toNumber(),
    };

    const determineUtxosForLowFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate: feeRates.hourFee.toNumber(),
    };

    const feesArr = [];

    const highFeeValue = getFeeForList(determineUtxosForHighFeeArgs);
    const standardFeeValue = getFeeForList(determineUtxosForStandardFeeArgs);
    const lowFeeValue = getFeeForList(determineUtxosForLowFeeArgs);

    if (highFeeValue) {
      feesArr.push({
        label: BtcFeeType.High,
        value: highFeeValue,
        btcValue: formatMoneyPadded(createMoney(highFeeValue, 'BTC')),
        time: btcTxTimeMap.fastestFee,
        fiatValue: getFiatFeeValue(highFeeValue),
        feeRate: feeRates.fastestFee.toNumber(),
      });
    }

    if (standardFeeValue) {
      feesArr.push({
        label: BtcFeeType.Standard,
        value: standardFeeValue,
        btcValue: formatMoneyPadded(createMoney(standardFeeValue, 'BTC')),
        time: btcTxTimeMap.halfHourFee,
        fiatValue: getFiatFeeValue(standardFeeValue),
        feeRate: feeRates.halfHourFee.toNumber(),
      });
    }

    if (lowFeeValue) {
      feesArr.push({
        label: BtcFeeType.Low,
        value: lowFeeValue,
        btcValue: formatMoneyPadded(createMoney(lowFeeValue, 'BTC')),
        time: btcTxTimeMap.hourFee,
        fiatValue: getFiatFeeValue(lowFeeValue),
        feeRate: feeRates.hourFee.toNumber(),
      });
    }

    return feesArr;
  }, [amount.amount, btcMarketData, feeRates, recipients, utxos]);

  return {
    feesList,
    isLoading,
  };
}

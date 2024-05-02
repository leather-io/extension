import { useMemo } from 'react';

import { BtcFeeType, btcTxTimeMap } from '@shared/models/fees/bitcoin-fees.model';
import { Money, createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import {
  DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

import { FeesListItem } from './bitcoin-fees-list';

function getFeeForList(
  determineUtxosForFeeArgs: DetermineUtxosForSpendArgs,
  isSendingMax?: boolean
) {
  try {
    const { fee } = isSendingMax
      ? determineUtxosForSpendAll(determineUtxosForFeeArgs)
      : determineUtxosForSpend(determineUtxosForFeeArgs);
    return fee;
  } catch (error) {
    return null;
  }
}

interface UseBitcoinFeesListArgs {
  amount: Money;
  isSendingMax?: boolean;
  recipient: string;
  utxos: UtxoResponseItem[];
}
export function useBitcoinFeesList({
  amount,
  isSendingMax,
  recipient,
  utxos,
}: UseBitcoinFeesListArgs) {
  const { balance } = useCurrentNativeSegwitAddressBalance();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const feesList: FeesListItem[] = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `~ ${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    if (!feeRates || !utxos.length) return [];

    const determineUtxosDefaultArgs = {
      recipients: [{ address: recipient, amount: isSendingMax ? balance : amount }],
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

    const highFeeValue = getFeeForList(determineUtxosForHighFeeArgs, isSendingMax);
    const standardFeeValue = getFeeForList(determineUtxosForStandardFeeArgs, isSendingMax);
    const lowFeeValue = getFeeForList(determineUtxosForLowFeeArgs, isSendingMax);

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
  }, [feeRates, utxos, isSendingMax, balance, amount, recipient, btcMarketData]);

  return {
    feesList,
    isLoading,
  };
}

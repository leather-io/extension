import { useMemo } from 'react';

import { BtcFeeType, Money, btcTxTimeMap } from '@leather.io/models';
import {
  type UtxoResponseItem,
  useAverageBitcoinFeeRates,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
} from '@leather.io/utils';

import {
  DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

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
  const { balance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();
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
      recipients: [
        { address: recipient, amount: isSendingMax ? balance.availableBalance : amount },
      ],
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
  }, [feeRates, utxos, recipient, isSendingMax, balance.availableBalance, amount, btcMarketData]);

  return {
    feesList,
    isLoading,
  };
}

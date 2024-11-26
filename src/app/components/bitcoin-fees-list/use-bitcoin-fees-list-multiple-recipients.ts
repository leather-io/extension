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

import type { TransferRecipient } from '@shared/models/form.model';

import {
  type DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { getSizeInfo } from '@app/common/transactions/bitcoin/utils';

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

function getApproximateFee({
  feeRate,
  recipients,
  utxos,
}: {
  feeRate: number;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}) {
  const size = getSizeInfo({
    inputLength: utxos.length + 1,
    recipients,
  });
  return Math.ceil(size.txVBytes * feeRate);
}

interface UseBitcoinFeesListArgs {
  amount: Money;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function useBitcoinFeesList({ amount, recipients, utxos }: UseBitcoinFeesListArgs) {
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const { feesList, approverFeesList, getCustomFeeData } = useMemo(() => {
    function getFiatFeeValue(fee: number) {
      return `${i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      )}`;
    }

    if (!feeRates || !utxos.length)
      return { feesList: [], approverFeesList: [], getCustomFeeData: () => null };

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

    function getBtcFeeValue(feeValue: number) {
      return formatMoneyPadded(createMoney(feeValue, 'BTC'));
    }

    function getApproverFeesList() {
      if (!feeRates) return [];

      const highFee =
        highFeeValue ??
        getApproximateFee({ feeRate: feeRates.fastestFee.toNumber(), recipients, utxos });

      const standardFee =
        standardFeeValue ??
        getApproximateFee({ feeRate: feeRates.halfHourFee.toNumber(), recipients, utxos });

      const lowFee =
        lowFeeValue ??
        getApproximateFee({ feeRate: feeRates.hourFee.toNumber(), recipients, utxos });

      return [
        {
          feeType: 'slow',
          baseUnitsValue: 100,
          feeRate: feeRates.hourFee.toNumber(),
          titleLeft: 'Slow',
          captionLeft: btcTxTimeMap.hourFee,
          titleRight: getBtcFeeValue(highFee),
          captionRight: `${feeRates?.hourFee.toNumber()} sats/vB · ${getFiatFeeValue(highFee)}`,
        },
        {
          feeType: 'standard',
          baseUnitsValue: 200,
          feeRate: feeRates.halfHourFee.toNumber(),
          titleLeft: 'Standard',
          captionLeft: btcTxTimeMap.halfHourFee,
          titleRight: getBtcFeeValue(standardFee),
          captionRight: `${feeRates?.halfHourFee.toNumber()} sats/vB · ${getFiatFeeValue(standardFee)}`,
        },

        {
          feeType: 'fast',
          baseUnitsValue: 300,
          feeRate: feeRates.hourFee.toNumber(),
          titleLeft: 'Fast',
          captionLeft: btcTxTimeMap.fastestFee,
          titleRight: getBtcFeeValue(lowFee),
          captionRight: `${feeRates?.fastestFee.toNumber()} sats/vB · ${getFiatFeeValue(lowFee)}`,
        },
      ];
    }

    function getCustomFeeData(feeRate: number) {
      const determineUtxosForFeeArgs = {
        ...determineUtxosDefaultArgs,
        feeRate,
      };
      const fee = getFeeForList(determineUtxosForFeeArgs);

      return {
        feeType: 'custom',
        feeRate,
        titleLeft: 'Custom',
        captionLeft: '',
        titleRight: fee ? getBtcFeeValue(fee) : 'N/A',
        captionRight: fee ? `${feeRate} sats/vB · ${getFiatFeeValue(fee)}` : 'N/A',
      };
    }

    return { feesList: feesArr, approverFeesList: getApproverFeesList(), getCustomFeeData };
  }, [amount.amount, btcMarketData, feeRates, recipients, utxos]);

  return {
    getCustomFeeData,
    approverFeesList,
    feesList,
    isLoading,
  };
}

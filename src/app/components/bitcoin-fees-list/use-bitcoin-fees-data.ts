import { useMemo } from 'react';

import { Money, btcTxTimeMap } from '@leather.io/models';
import {
  type UtxoResponseItem,
  useAverageBitcoinFeeRates,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import {
  baseCurrencyAmountInQuote,
  capitalize,
  createMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
  isUndefined,
} from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import type { FeeDisplayInfo, FeeType } from '@app/common/fees/use-fees';
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

export interface RawFee {
  type: FeeType;
  baseUnitsFeeValue: number | null;
  feeRate: number | null;
  time: string;
}

function getBtcFeeValue(feeValue: number) {
  return formatMoneyPadded(createMoney(feeValue, 'BTC'));
}

interface UseBitcoinFeesListArgs {
  amount: Money;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}

export type FeesRawData = Record<Exclude<FeeType, 'custom'>, RawFee>;

export function useBitcoinFeeData({ amount, recipients, utxos }: UseBitcoinFeesListArgs) {
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const satAmount = amount.amount.toNumber();

  const determineUtxosDefaultArgs = useMemo(() => {
    return {
      amount: satAmount,
      recipients,
      utxos,
    };
  }, [satAmount, recipients, utxos]);

  function getCustomFeeData(feeRate: number): RawFee {
    const determineUtxosForFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate,
    };
    const fee = getFeeForList(determineUtxosForFeeArgs);

    return {
      type: 'custom',
      baseUnitsFeeValue: fee,
      feeRate,
      time: '',
    };
  }

  function formatFeeForDisplay(fee: RawFee): FeeDisplayInfo {
    function getFiatFeeValue(fee: number) {
      return i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BTC'), btcMarketData)
      );
    }

    const { type, baseUnitsFeeValue, feeRate, time } = fee;

    return {
      feeType: type,
      feeRate: feeRate ?? 0,
      baseUnitsValue: baseUnitsFeeValue ?? 0,
      titleLeft: capitalize(type),
      captionLeft: time,
      titleRight: baseUnitsFeeValue ? getBtcFeeValue(baseUnitsFeeValue) : 'N/A',
      captionRight: baseUnitsFeeValue
        ? `${feeRate} sats/vB · ${getFiatFeeValue(baseUnitsFeeValue)}`
        : 'N/A',
    };
  }

  const fees = useMemo<FeesRawData>(() => {
    if (isUndefined(feeRates)) {
      return {} as FeesRawData;
    }

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

    const highFeeValue = getFeeForList(determineUtxosForHighFeeArgs);
    const standardFeeValue = getFeeForList(determineUtxosForStandardFeeArgs);
    const lowFeeValue = getFeeForList(determineUtxosForLowFeeArgs);

    const highFee =
      highFeeValue ??
      getApproximateFee({ feeRate: feeRates.fastestFee.toNumber(), recipients, utxos });

    const standardFee =
      standardFeeValue ??
      getApproximateFee({ feeRate: feeRates.halfHourFee.toNumber(), recipients, utxos });

    const lowFee =
      lowFeeValue ?? getApproximateFee({ feeRate: feeRates.hourFee.toNumber(), recipients, utxos });

    return {
      slow: {
        type: 'slow',
        baseUnitsFeeValue: lowFee,
        feeRate: feeRates.hourFee.toNumber(),
        time: btcTxTimeMap.hourFee,
      },
      standard: {
        type: 'standard',
        baseUnitsFeeValue: standardFee,
        feeRate: feeRates.halfHourFee.toNumber(),
        time: btcTxTimeMap.halfHourFee,
      },
      fast: {
        type: 'fast',
        baseUnitsFeeValue: highFee,
        feeRate: feeRates.fastestFee.toNumber(),
        time: btcTxTimeMap.fastestFee,
      },
    };
  }, [feeRates, recipients, utxos, determineUtxosDefaultArgs]);

  return {
    getCustomFeeData,
    fees,
    formatFeeForDisplay,
    isLoading,
  };
}

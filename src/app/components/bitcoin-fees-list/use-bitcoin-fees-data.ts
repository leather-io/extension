import { useMemo } from 'react';

import { type Money, btcTxTimeMap } from '@leather.io/models';
import { type UtxoResponseItem, useAverageBitcoinFeeRates } from '@leather.io/query';
import { isUndefined } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import type { FeesRawData } from '@app/common/fees/use-fees';

import {
  type RawFee,
  getApproximateFee,
  getBitcoinFee,
  getBitcoinSendMaxFee,
} from './bitcoin-fees.utils';

interface UseBitcoinFeeDataArgs {
  amount: Money;
  isSendingMax?: boolean;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}

export function useBitcoinFeeData({
  amount,
  recipients,
  utxos,
  isSendingMax,
}: UseBitcoinFeeDataArgs) {
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
    const fee = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForFeeArgs)
      : getBitcoinFee(determineUtxosForFeeArgs);

    return {
      type: 'custom',
      baseUnitsFeeValue: fee,
      feeRate,
      time: '',
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

    const highFeeValue = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForHighFeeArgs)
      : getBitcoinFee(determineUtxosForHighFeeArgs);

    const standardFeeValue = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForStandardFeeArgs)
      : getBitcoinFee(determineUtxosForStandardFeeArgs);

    const lowFeeValue = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForLowFeeArgs)
      : getBitcoinFee(determineUtxosForLowFeeArgs);

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
  }, [feeRates, recipients, utxos, determineUtxosDefaultArgs, isSendingMax]);

  return {
    getCustomFeeData,
    fees,
    isLoading,
  };
}

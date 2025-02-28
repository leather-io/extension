import { useMemo } from 'react';

import { type Money, btcTxTimeMap } from '@leather.io/models';
import { type UtxoResponseItem, useAverageBitcoinFeeRates } from '@leather.io/query';
import { isUndefined } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import type { RawFee, RawFees } from '../fee-editor.context';
import { getApproximateFee, getBitcoinFee, getBitcoinSendMaxFee } from './bitcoin-fees.utils';

interface UseBitcoinFeesArgs {
  amount: Money;
  isSendingMax?: boolean;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function useBitcoinFees({ amount, isSendingMax, recipients, utxos }: UseBitcoinFeesArgs) {
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

  const satAmount = amount.amount.toNumber();

  const determineUtxosDefaultArgs = useMemo(() => {
    return {
      amount: satAmount,
      recipients,
      utxos,
    };
  }, [satAmount, recipients, utxos]);

  const rawFees = useMemo<RawFees>(() => {
    if (isUndefined(feeRates)) return;

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
        baseUnitFeeValue: lowFee,
        feeRate: feeRates.hourFee.toNumber(),
        time: btcTxTimeMap.hourFee,
      },
      standard: {
        type: 'standard',
        baseUnitFeeValue: standardFee,
        feeRate: feeRates.halfHourFee.toNumber(),
        time: btcTxTimeMap.halfHourFee,
      },
      fast: {
        type: 'fast',
        baseUnitFeeValue: highFee,
        feeRate: feeRates.fastestFee.toNumber(),
        time: btcTxTimeMap.fastestFee,
      },
    };
  }, [feeRates, determineUtxosDefaultArgs, isSendingMax, recipients, utxos]);

  return {
    rawFees,
    isLoading,
    getCustomFeeData(feeRate: number): RawFee {
      const determineUtxosForFeeArgs = {
        ...determineUtxosDefaultArgs,
        feeRate,
      };
      const feeAsMoney = isSendingMax
        ? getBitcoinSendMaxFee(determineUtxosForFeeArgs)
        : getBitcoinFee(determineUtxosForFeeArgs);

      return {
        type: 'custom',
        baseUnitFeeValue: feeAsMoney,
        feeRate,
        time: '',
      };
    },
  };
}

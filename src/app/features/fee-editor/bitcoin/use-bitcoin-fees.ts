import { useMemo } from 'react';

import type { AverageBitcoinFeeRates, Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';

import { type Fees, feePriorityTimeMap } from '../fee-editor.context';
import { getApproximateFee, getBitcoinFee, getBitcoinSendMaxFee } from './bitcoin-fees.utils';

interface UseBitcoinFeesArgs {
  amount: Money;
  feeRates?: AverageBitcoinFeeRates;
  isSendingMax?: boolean;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function useBitcoinFees({
  amount,
  feeRates,
  isSendingMax,
  recipients,
  utxos,
}: UseBitcoinFeesArgs) {
  const satAmount = amount.amount.toNumber();

  const determineUtxosDefaultArgs = useMemo(() => {
    return {
      amount: satAmount,
      recipients,
      utxos,
    };
  }, [satAmount, recipients, utxos]);

  const fees = useMemo<Fees | undefined>(() => {
    if (!feeRates) return;

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
        priority: 'slow',
        feeRate: feeRates.hourFee.toNumber(),
        txFee: lowFee,
        time: feePriorityTimeMap.slow,
      },
      standard: {
        priority: 'standard',
        feeRate: feeRates.halfHourFee.toNumber(),
        txFee: standardFee,
        time: feePriorityTimeMap.standard,
      },
      fast: {
        priority: 'fast',
        feeRate: feeRates.fastestFee.toNumber(),
        txFee: highFee,
        time: feePriorityTimeMap.fast,
      },
      // Load custom as standard fee
      custom: {
        priority: 'custom',
        feeRate: feeRates.halfHourFee.toNumber(),
        txFee: standardFee,
        time: feePriorityTimeMap.custom,
      },
    };
  }, [determineUtxosDefaultArgs, feeRates, isSendingMax, recipients, utxos]);

  return {
    determineUtxosDefaultArgs,
    fees,
  };
}

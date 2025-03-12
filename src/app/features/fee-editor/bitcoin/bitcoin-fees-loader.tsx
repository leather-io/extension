import { useMemo } from 'react';

import { type Money, btcTxTimeMap } from '@leather.io/models';
import { type UtxoResponseItem, useAverageBitcoinFeeRates } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';

import type { Fee, Fees } from '../fee-editor.context';
import { getApproximateFee, getBitcoinFee, getBitcoinSendMaxFee } from './bitcoin-fees.utils';

interface BitcoinFeesLoaderProps {
  amount: Money;
  children(
    fees: Fees | undefined,
    isLoading: boolean,
    getCustomFee: (rate: number) => Fee
  ): React.ReactNode;
  isSendingMax?: boolean;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function BitcoinFeesLoader({
  amount,
  children,
  isSendingMax,
  recipients,
  utxos,
}: BitcoinFeesLoaderProps) {
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();

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
        type: 'slow',
        feeRate: feeRates.hourFee.toNumber(),
        feeValue: lowFee,
        time: btcTxTimeMap.hourFee,
      },
      standard: {
        type: 'standard',
        feeRate: feeRates.halfHourFee.toNumber(),
        feeValue: standardFee,
        time: btcTxTimeMap.halfHourFee,
      },
      fast: {
        type: 'fast',
        feeRate: feeRates.fastestFee.toNumber(),
        feeValue: highFee,
        time: btcTxTimeMap.fastestFee,
      },
      // Load custom as standard fee
      custom: {
        type: 'custom',
        feeRate: feeRates.halfHourFee.toNumber(),
        feeValue: standardFee,
        time: '',
      },
    };
  }, [feeRates, determineUtxosDefaultArgs, isSendingMax, recipients, utxos]);

  function getCustomFee(feeRate: number): Fee {
    const determineUtxosForFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate,
    };
    const feeAsMoney = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForFeeArgs)
      : getBitcoinFee(determineUtxosForFeeArgs);

    return {
      type: 'custom',
      feeRate,
      feeValue: feeAsMoney,
      time: '',
    };
  }

  return children(fees, isLoading, getCustomFee);
}

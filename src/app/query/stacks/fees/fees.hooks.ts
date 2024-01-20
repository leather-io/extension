import { useMemo } from 'react';

import { StacksTransaction } from '@stacks/transactions';

import { FeeCalculationTypes, Fees } from '@shared/models/fees/fees.model';
import { StacksFeeEstimate, StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';
import { Money, createMoney } from '@shared/models/money.model';

import {
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMaxValues,
  useConfigFeeEstimationsMinEnabled,
  useConfigFeeEstimationsMinValues,
} from '@app/query/common/remote-config/remote-config.query';
import { useGetStacksTransactionFeeEstimationQuery } from '@app/query/stacks/fees/fees.query';

import {
  defaultFeesMaxValuesAsMoney,
  defaultFeesMinValuesAsMoney,
  defaultStacksFees,
  feeEstimationQueryFailedSilently,
  getDefaultSimulatedFeeEstimations,
  getEstimatedUnsignedStacksTxByteLength,
  getFeeEstimationsWithCappedValues,
  getSerializedUnsignedStacksTxPayload,
} from './fees.utils';

function useFeeEstimationsMaxValues() {
  const configFeeEstimationsMaxEnabled = useConfigFeeEstimationsMaxEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();

  if (configFeeEstimationsMaxEnabled === false) return;
  return configFeeEstimationsMaxValues || defaultFeesMaxValuesAsMoney;
}

function useFeeEstimationsMinValues() {
  const configFeeEstimationsMinEnabled = useConfigFeeEstimationsMinEnabled();
  const configFeeEstimationsMinValues = useConfigFeeEstimationsMinValues();

  if (configFeeEstimationsMinEnabled === false) return;
  return configFeeEstimationsMinValues || defaultFeesMinValuesAsMoney;
}

interface ParseStacksTxFeeEstimationResponseArgs {
  feeEstimation: StacksTxFeeEstimation;
  maxValues?: Money[];
  minValues?: Money[];
  txByteLength: number | null;
}
function parseStacksTxFeeEstimationResponse({
  feeEstimation,
  maxValues,
  minValues,
  txByteLength,
}: ParseStacksTxFeeEstimationResponseArgs): Fees {
  if (!!feeEstimation.error) return defaultStacksFees;
  if (txByteLength && feeEstimationQueryFailedSilently(feeEstimation)) {
    return {
      blockchain: 'stacks',
      estimates: getDefaultSimulatedFeeEstimations(txByteLength),
      calculation: FeeCalculationTypes.DefaultSimulated,
    };
  }

  const stacksFeeEstimates: StacksFeeEstimate[] = feeEstimation.estimations.map(estimate => {
    return {
      fee: createMoney(estimate.fee, 'STX'),
      feeRate: estimate.fee_rate,
    };
  });

  if (feeEstimation.estimations && feeEstimation.estimations.length) {
    const feeEstimationsWithCappedValues = getFeeEstimationsWithCappedValues(
      stacksFeeEstimates,
      maxValues,
      minValues
    );
    return {
      blockchain: 'stacks',
      estimates: feeEstimationsWithCappedValues,
      calculation: FeeCalculationTypes.FeesCapped,
    };
  }
  return {
    blockchain: 'stacks',
    estimates: stacksFeeEstimates ?? [],
    calculation: FeeCalculationTypes.Api,
  };
}

export function useCalculateStacksTxFees(unsignedTx?: StacksTransaction) {
  const feeEstimationsMaxValues = useFeeEstimationsMaxValues();
  const feeEstimationsMinValues = useFeeEstimationsMinValues();

  const { txByteLength, txPayload } = useMemo(() => {
    if (!unsignedTx) return { txByteLength: null, txPayload: '' };

    return {
      txByteLength: getEstimatedUnsignedStacksTxByteLength(unsignedTx),
      txPayload: getSerializedUnsignedStacksTxPayload(unsignedTx),
    };
  }, [unsignedTx]);

  return useGetStacksTransactionFeeEstimationQuery(txByteLength, txPayload, {
    select: resp =>
      parseStacksTxFeeEstimationResponse({
        feeEstimation: resp,
        maxValues: feeEstimationsMaxValues,
        minValues: feeEstimationsMinValues,
        txByteLength,
      }),
  });
}

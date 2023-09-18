import { useMemo } from 'react';

import { StacksTransaction } from '@stacks/transactions';

import { logger } from '@shared/logger';
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
  getDefaultSimulatedFeeEstimations,
  getEstimatedUnsignedStacksTxByteLength,
  getFeeEstimationsWithCappedValues,
  getSerializedUnsignedStacksTxPayload,
} from './fees.utils';

const defaultFeesMaxValues = [
  createMoney(500000, 'STX'),
  createMoney(750000, 'STX'),
  createMoney(2000000, 'STX'),
];
export const defaultFeesMinValues = [
  createMoney(2500, 'STX'),
  createMoney(3000, 'STX'),
  createMoney(3500, 'STX'),
];

const defaultStacksFeeEstimates: StacksFeeEstimate[] = [
  { fee: defaultFeesMinValues[0], feeRate: 0 },
  { fee: defaultFeesMinValues[1], feeRate: 0 },
  { fee: defaultFeesMinValues[2], feeRate: 0 },
];

const defaultStacksFees: Fees = {
  blockchain: 'stacks',
  estimates: defaultStacksFeeEstimates,
  calculation: FeeCalculationTypes.Default,
};

function feeEstimationQueryFailedSilently(feeEstimation: StacksTxFeeEstimation) {
  return !!(feeEstimation && (!!feeEstimation.error || !feeEstimation.estimations.length));
}

function useFeeEstimationsMaxValues() {
  const configFeeEstimationsMaxEnabled = useConfigFeeEstimationsMaxEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();

  if (configFeeEstimationsMaxEnabled === false) return;
  return configFeeEstimationsMaxValues || defaultFeesMaxValues;
}

function useFeeEstimationsMinValues() {
  const configFeeEstimationsMinEnabled = useConfigFeeEstimationsMinEnabled();
  const configFeeEstimationsMinValues = useConfigFeeEstimationsMinValues();

  if (configFeeEstimationsMinEnabled === false) return;
  return configFeeEstimationsMinValues || defaultFeesMinValues;
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
  if (!!feeEstimation.error) defaultStacksFees;
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
    onError: err => logger.error('Error getting stacks tx fee estimation', { err }),
    select: resp =>
      parseStacksTxFeeEstimationResponse({
        feeEstimation: resp,
        maxValues: feeEstimationsMaxValues,
        minValues: feeEstimationsMinValues,
        txByteLength,
      }),
  });
}

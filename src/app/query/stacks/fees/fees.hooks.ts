import { useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { FeeCalculationTypes, FeeEstimations } from '@shared/models/fees/_fees.model';
import { StacksFeeEstimate, StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';

import {
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMaxValues,
  useConfigFeeEstimationsMinEnabled,
  useConfigFeeEstimationsMinValues,
} from '@app/query/common/hiro-config/hiro-config.query';
import { useGetTransactionFeeEstimationQuery } from '@app/query/stacks/fees/fees.query';

import { getDefaultSimulatedFeeEstimations, getFeeEstimationsWithCappedValues } from './fees.utils';

const defaultFeesMaxValues = [500000, 750000, 2000000];
const defaultFeesMinValues = [2500, 3000, 3500];

const defaultFeeEstimations: StacksFeeEstimate[] = [
  { fee: defaultFeesMinValues[0], feeRate: 0 },
  { fee: defaultFeesMinValues[1], feeRate: 0 },
  { fee: defaultFeesMinValues[2], feeRate: 0 },
];

function useTransactionFeeEstimation(
  estimatedLen: number | null,
  transactionPayload: string
): UseQueryResult<StacksTxFeeEstimation> {
  return useGetTransactionFeeEstimationQuery(estimatedLen, transactionPayload);
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

function feeEstimationQueryFailedSilently(
  feeEstimationResult: UseQueryResult<StacksTxFeeEstimation>
) {
  return !!(
    feeEstimationResult.data &&
    !feeEstimationResult.isLoading &&
    (!!feeEstimationResult?.error || !feeEstimationResult.data.estimations?.length)
  );
}

export function useStacksFeeEstimations(txByteLength: number | null, txPayload: string) {
  const feeEstimationsMaxValues = useFeeEstimationsMaxValues();
  const feeEstimationsMinValues = useFeeEstimationsMinValues();
  const result = useTransactionFeeEstimation(txByteLength, txPayload);
  const { data: txFeeEstimation, isError, isLoading } = result;

  return useMemo<FeeEstimations>(() => {
    const feeEstimations = txFeeEstimation?.estimations;

    if (!isLoading && isError) {
      return {
        blockchain: 'stacks',
        estimates: defaultFeeEstimations,
        calculation: FeeCalculationTypes.Default,
      };
    }
    if (txByteLength && feeEstimationQueryFailedSilently(result)) {
      return {
        blockchain: 'stacks',
        estimates: getDefaultSimulatedFeeEstimations(txByteLength),
        calculation: FeeCalculationTypes.DefaultSimulated,
      };
    }
    if (feeEstimations?.length) {
      const feeEstimationsWithCappedValues = getFeeEstimationsWithCappedValues(
        feeEstimations,
        feeEstimationsMaxValues,
        feeEstimationsMinValues
      );
      return {
        blockchain: 'stacks',
        estimates: feeEstimationsWithCappedValues,
        calculation: FeeCalculationTypes.FeesCapped,
      };
    }
    return {
      blockchain: 'stacks',
      estimates: feeEstimations ?? [],
      calculation: FeeCalculationTypes.Api,
    };
  }, [
    feeEstimationsMaxValues,
    feeEstimationsMinValues,
    isError,
    isLoading,
    result,
    txByteLength,
    txFeeEstimation?.estimations,
  ]);
}

import { useMemo } from 'react';

import {
  FeeCalculationType,
  FeeEstimate,
  FeeEstimation,
  TransactionFeeEstimation,
} from '@shared/models/fees-types';
import {
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMaxValues,
  useConfigFeeEstimationsMinEnabled,
  useConfigFeeEstimationsMinValues,
} from '@app/query/hiro-config/hiro-config.query';
import { useGetTransactionFeeEstimationQuery } from '@app/query/fees/fees.query';

import { getDefaultSimulatedFeeEstimations, getFeeEstimationsWithCappedValues } from './fees.utils';
import { UseQueryResult } from 'react-query';

const defaultFeesMaxValues = [500000, 750000, 2000000];
const defaultFeesMinValues = [2500, 3000, 3500];

const defaultFeeEstimations: FeeEstimate[] = [
  { fee: defaultFeesMinValues[0], fee_rate: 0 },
  { fee: defaultFeesMinValues[1], fee_rate: 0 },
  { fee: defaultFeesMinValues[2], fee_rate: 0 },
];

function useTransactionFeeEstimation(
  estimatedLen: number | null,
  transactionPayload: string
): UseQueryResult<TransactionFeeEstimation, Error> {
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

export function useFeeEstimations(txByteLength: number | null, txPayload: string) {
  const feeEstimationsMaxValues = useFeeEstimationsMaxValues();
  const feeEstimationsMinValues = useFeeEstimationsMinValues();
  const result = useTransactionFeeEstimation(txByteLength, txPayload);
  const { data: txFeeEstimation, isError, isLoading } = result;

  return useMemo<FeeEstimation>(() => {
    const feeEstimations = txFeeEstimation?.estimations;

    if (!isLoading && isError) {
      return { estimates: defaultFeeEstimations, calculation: FeeCalculationType.Default };
    }
    if (!isLoading && (!!txFeeEstimation?.error || !feeEstimations?.length) && txByteLength) {
      return {
        estimates: getDefaultSimulatedFeeEstimations(txByteLength),
        calculation: FeeCalculationType.DefaultSimulated,
      };
    }
    if (feeEstimations?.length) {
      const feeEstimationsWithCappedValues = getFeeEstimationsWithCappedValues(
        feeEstimations,
        feeEstimationsMaxValues,
        feeEstimationsMinValues
      );
      return {
        estimates: feeEstimationsWithCappedValues,
        calculation: FeeCalculationType.FeesCapped,
      };
    }
    return { estimates: feeEstimations ?? [], calculation: FeeCalculationType.Api };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txByteLength, txFeeEstimation]);
}

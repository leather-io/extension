/*
  This file is being kept to handle the legacy send form (pre-bitcoin).
  It should be removed with the legacy send form.
*/
import { useMemo } from 'react';

import { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_FEE_RATE } from '@shared/constants';
import {
  FeesLegacy,
  StacksFeeEstimateLegacy,
  StacksTxFeeEstimationLegacy,
} from '@shared/models/fees/_fees-legacy.model';
import { FeeCalculationTypes } from '@shared/models/fees/_fees.model';

import { fetcher } from '@app/common/api/wrapped-fetch';
import {
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMinEnabled,
  useRemoteHiroConfig,
} from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

const staleTime = 5 * 60 * 1000; // 5 min

const feeEstimationsQueryOptions = {
  staleTime,
} as const;

function useGetTransactionFeeEstimationQuery(
  estimatedLen: number | null,
  transactionPayload: string
) {
  const currentNetwork = useCurrentNetworkState();

  const fetchTransactionFeeEstimation = async () => {
    const response = await fetcher(currentNetwork.chain.stacks.url + '/v2/fees/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction_payload: transactionPayload,
        estimated_len: estimatedLen,
      }),
    });
    const data = await response.json();
    return data as StacksTxFeeEstimationLegacy;
  };

  return useQuery({
    queryKey: ['transaction-fee-estimation', transactionPayload],
    queryFn: fetchTransactionFeeEstimation,
    enabled: transactionPayload !== '',
    ...feeEstimationsQueryOptions,
  }) as UseQueryResult<StacksTxFeeEstimationLegacy>;
}

const defaultFeesMaxValues = [500000, 750000, 2000000];
const defaultFeesMinValues = [2500, 3000, 3500];

const defaultFeeEstimations: StacksFeeEstimateLegacy[] = [
  { fee: defaultFeesMinValues[0], feeRate: 0 },
  { fee: defaultFeesMinValues[1], feeRate: 0 },
  { fee: defaultFeesMinValues[2], feeRate: 0 },
];

function getFeeEstimationsWithCappedValues(
  feeEstimations: StacksFeeEstimateLegacy[],
  feeEstimationsMaxValues: number[] | undefined,
  feeEstimationsMinValues: number[] | undefined
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(feeEstimationsMaxValues[index])
    ) {
      return { fee: feeEstimationsMaxValues[index], feeRate: 0 };
    } else if (
      feeEstimationsMinValues &&
      new BigNumber(feeEstimation.fee).isLessThan(feeEstimationsMinValues[index])
    ) {
      return { fee: feeEstimationsMinValues[index], feeRate: 0 };
    } else {
      return feeEstimation;
    }
  });
}

function calculateFeeFromFeeRate(txBytes: number, feeRate: number) {
  return new BigNumber(txBytes).multipliedBy(feeRate);
}

const marginFromDefaultFeeDecimalPercent = 0.1;

function getDefaultSimulatedFeeEstimations(estimatedByteLength: number): StacksFeeEstimateLegacy[] {
  const fee = calculateFeeFromFeeRate(estimatedByteLength, DEFAULT_FEE_RATE);
  return [
    { fee: fee.multipliedBy(1 - marginFromDefaultFeeDecimalPercent).toNumber(), feeRate: 0 },
    { fee: fee.toNumber(), feeRate: 0 },
    { fee: fee.multipliedBy(1 + marginFromDefaultFeeDecimalPercent).toNumber(), feeRate: 0 },
  ];
}

function useTransactionFeeEstimation(
  estimatedLen: number | null,
  transactionPayload: string
): UseQueryResult<StacksTxFeeEstimationLegacy> {
  return useGetTransactionFeeEstimationQuery(estimatedLen, transactionPayload);
}

function useConfigFeeEstimationsMaxValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.maxValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.maxValues)) return;
  return config.feeEstimationsMinMax.maxValues;
}

function useFeeEstimationsMaxValues() {
  const configFeeEstimationsMaxEnabled = useConfigFeeEstimationsMaxEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();

  if (configFeeEstimationsMaxEnabled === false) return;
  return configFeeEstimationsMaxValues || defaultFeesMaxValues;
}

function useConfigFeeEstimationsMinValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.minValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.minValues)) return;
  return config.feeEstimationsMinMax.minValues;
}

function useFeeEstimationsMinValues() {
  const configFeeEstimationsMinEnabled = useConfigFeeEstimationsMinEnabled();
  const configFeeEstimationsMinValues = useConfigFeeEstimationsMinValues();

  if (configFeeEstimationsMinEnabled === false) return;
  return configFeeEstimationsMinValues || defaultFeesMinValues;
}

function feeEstimationQueryFailedSilently(
  feeEstimationResult: UseQueryResult<StacksTxFeeEstimationLegacy>
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

  return useMemo<FeesLegacy>(() => {
    const feeEstimations = txFeeEstimation?.estimations;

    if ((!isLoading && isError) || txFeeEstimation?.error) {
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
    txFeeEstimation?.error,
    txFeeEstimation?.estimations,
  ]);
}

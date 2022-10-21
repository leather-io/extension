import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { fetcher } from '@app/common/api/wrapped-fetch';
import { TransactionFeeEstimation } from '@shared/models/fees-types';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

const staleTime = 5 * 60 * 1000; // 5 min

const feeEstimationsQueryOptions = {
  staleTime,
} as const;

export function useGetTransactionFeeEstimationQuery(
  estimatedLen: number | null,
  transactionPayload: string
) {
  const currentNetwork = useCurrentNetworkState();

  const fetchTransactionFeeEstimation = async () => {
    const response = await fetcher(currentNetwork.url + '/v2/fees/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction_payload: transactionPayload,
        estimated_len: estimatedLen,
      }),
    });
    const data = await response.json();
    return data as TransactionFeeEstimation;
  };

  return useQuery({
    queryKey: ['transaction-fee-estimation', transactionPayload],
    queryFn: fetchTransactionFeeEstimation,
    enabled: transactionPayload !== '',
    ...feeEstimationsQueryOptions,
  }) as UseQueryResult<TransactionFeeEstimation>;
}

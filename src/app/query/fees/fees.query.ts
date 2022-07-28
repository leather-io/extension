import { useQuery, UseQueryResult } from 'react-query';

import { fetcher } from '@app/common/api/wrapped-fetch';
import { TransactionFeeEstimation } from '@shared/models/fees-types';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const feeEstimationsQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
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
    ...feeEstimationsQueryOptions,
  }) as UseQueryResult<TransactionFeeEstimation, Error>;
}

import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';

import { fetcher } from '@app/common/api/wrapped-fetch';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../rate-limiter';

const staleTime = 5 * 60 * 1000; // 5 min

const feeEstimationsQueryOptions = {
  staleTime,
} as const;

export function useGetTransactionFeeEstimationQuery(
  estimatedLen: number | null,
  transactionPayload: string
) {
  const currentNetwork = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  const fetchTransactionFeeEstimation = async () => {
    await limiter.removeTokens(1);
    const response = await fetcher(currentNetwork.chain.stacks.url + '/v2/fees/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction_payload: transactionPayload,
        estimated_len: estimatedLen,
      }),
    });
    const data = await response.json();
    return data as StacksTxFeeEstimation;
  };

  return useQuery({
    queryKey: ['transaction-fee-estimation', transactionPayload],
    queryFn: fetchTransactionFeeEstimation,
    enabled: transactionPayload !== '',
    ...feeEstimationsQueryOptions,
  }) as UseQueryResult<StacksTxFeeEstimation>;
}

import { useQuery } from '@tanstack/react-query';

import { StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';

import { fetcher } from '@app/common/api/wrapped-fetch';
import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

function fetchTransactionFeeEstimation(currentNetwork: any, limiter: RateLimiter) {
  return async (estimatedLen: number | null, transactionPayload: string) => {
    await limiter.removeTokens(1);
    const resp = await fetcher(currentNetwork.chain.stacks.url + '/v2/fees/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estimated_len: estimatedLen,
        transaction_payload: transactionPayload,
      }),
    });
    const data = await resp.json();
    return data as StacksTxFeeEstimation;
  };
}

type FetchTransactionFeeEstimationResp = Awaited<
  ReturnType<ReturnType<typeof fetchTransactionFeeEstimation>>
>;

export function useGetStacksTransactionFeeEstimationQuery<
  T extends unknown = FetchTransactionFeeEstimationResp,
>(
  estimatedLen: number | null,
  transactionPayload: string,
  options?: AppUseQueryConfig<FetchTransactionFeeEstimationResp, T>
) {
  const currentNetwork = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: transactionPayload !== '',
    queryKey: ['stacks-tx-fee-estimation', transactionPayload],
    queryFn: () =>
      fetchTransactionFeeEstimation(currentNetwork, limiter)(estimatedLen, transactionPayload),
    ...options,
  });
}

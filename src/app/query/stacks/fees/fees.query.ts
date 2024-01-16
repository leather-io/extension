import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

function fetchTransactionFeeEstimation(currentNetwork: any, limiter: RateLimiter) {
  return async (estimatedLen: number | null, transactionPayload: string) => {
    await limiter.removeTokens(1);
    const resp = await axios.post<StacksTxFeeEstimation>(
      currentNetwork.chain.stacks.url + '/v2/fees/transaction',
      {
        estimated_len: estimatedLen,
        transaction_payload: transactionPayload,
      }
    );
    return resp.data;
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

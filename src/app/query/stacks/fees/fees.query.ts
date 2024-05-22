import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PQueue from 'p-queue';

import { logger } from '@shared/logger';
import { StacksTxFeeEstimation } from '@shared/models/fees/stacks-fees.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';
import { defaultApiFeeEstimations } from './fees.utils';

function fetchTransactionFeeEstimation(currentNetwork: any, limiter: PQueue) {
  return async (estimatedLen: number | null, transactionPayload: string) => {
    const resp = await limiter.add(
      () =>
        axios.post<StacksTxFeeEstimation>(
          currentNetwork.chain.stacks.url + '/v2/fees/transaction',
          {
            estimated_len: estimatedLen,
            transaction_payload: transactionPayload,
          }
        ),
      {
        priority: 2,
        throwOnTimeout: true,
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
    queryFn: async () => {
      try {
        return await fetchTransactionFeeEstimation(currentNetwork, limiter)(
          estimatedLen,
          transactionPayload
        );
      } catch (err) {
        logger.error('Error getting stacks tx fee estimation', { err });
        return {
          cost_scalar_change_by_byte: 0,
          estimated_cost: {},
          estimated_cost_scalar: 0,
          estimations: defaultApiFeeEstimations,
          error: err ?? 'Error',
        } as StacksTxFeeEstimation;
      }
    },
    ...options,
  });
}

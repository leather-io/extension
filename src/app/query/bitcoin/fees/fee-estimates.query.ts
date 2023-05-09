import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { BitcoinClient } from '../bitcoin-client';

function fetchAllBitcoinFeeEstimates(client: BitcoinClient) {
  return async () => {
    return Promise.allSettled([
      client.feeEstimatesApi.getFeeEstimatesFromMempoolSpaceApi(),
      client.feeEstimatesApi.getFeeEstimatesFromEarnApi(),
    ]);
  };
}

type FetchAllBitcoinFeeEstimatesResp = Awaited<
  ReturnType<ReturnType<typeof fetchAllBitcoinFeeEstimates>>
>;

export function useGetAllBitcoinFeeEstimatesQuery<
  T extends unknown = FetchAllBitcoinFeeEstimatesResp
>(options?: AppUseQueryConfig<FetchAllBitcoinFeeEstimatesResp, T>) {
  const client = useBitcoinClient();
  return useQuery({
    queryKey: ['all-bitcoin-fee-estimates'],
    queryFn: fetchAllBitcoinFeeEstimates(client),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
}

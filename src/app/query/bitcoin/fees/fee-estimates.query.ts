import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { BitcoinClient } from '../bitcoin-client';

// Mempool api
function fetchMempoolApiBitcoinFeeEstimates(client: BitcoinClient) {
  return async () => {
    return client.feeEstimatesApi.getFeeEstimatesFromMempoolSpaceApi();
  };
}

type FetchMempoolApiBitcoinFeeEstimatesResp = Awaited<
  ReturnType<ReturnType<typeof fetchMempoolApiBitcoinFeeEstimates>>
>;

// https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
// Possible alt api if needed: https://bitcoinfees.earn.com/api
export function useGetBitcoinMempoolApiFeeEstimatesQuery<
  T extends unknown = FetchMempoolApiBitcoinFeeEstimatesResp
>(options?: AppUseQueryConfig<FetchMempoolApiBitcoinFeeEstimatesResp, T>) {
  const client = useBitcoinClient();
  return useQuery({
    queryKey: ['mempool-api-bitcoin-fee-estimates'],
    queryFn: fetchMempoolApiBitcoinFeeEstimates(client),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
}

// Earn api
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

export function useGetBitcoinAllFeeEstimatesQuery<
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

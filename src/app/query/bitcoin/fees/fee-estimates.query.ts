import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import type { BitcoinClient } from '../bitcoin-client';

function fetchBitcoinFeeEstimates(client: BitcoinClient) {
  return async () => {
    return client.feeEstimatesApi.getFeeEstimatesFromMempoolSpaceApi();
  };
}

type FetchBitcoinFeeEstimatesResp = Awaited<
  ReturnType<ReturnType<typeof fetchBitcoinFeeEstimates>>
>;

// https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
// Possible alt api if needed: https://bitcoinfees.earn.com/api
export function useGetBitcoinFeeEstimatesQuery<T extends unknown = FetchBitcoinFeeEstimatesResp>(
  options?: AppUseQueryConfig<FetchBitcoinFeeEstimatesResp, T>
) {
  const client = useBitcoinClient();
  return useQuery({
    queryKey: ['bitcoin-fee-estimates'],
    queryFn: fetchBitcoinFeeEstimates(client),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
}

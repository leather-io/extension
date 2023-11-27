import { useQuery } from '@tanstack/react-query';

import { BitcoinNetworkModes } from '@shared/constants';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { BitcoinClient } from '../bitcoin-client';

function fetchAllBitcoinFeeEstimates(client: BitcoinClient, network: BitcoinNetworkModes) {
  return async () =>
    network === 'mainnet'
      ? Promise.allSettled([
          client.feeEstimatesApi.getFeeEstimatesFromMempoolSpaceApi(),
          client.feeEstimatesApi.getFeeEstimatesFromBlockcypherApi('main'),
        ])
      : // Using `allSettled` so we can add more testnet apis to the array
        Promise.allSettled([client.feeEstimatesApi.getFeeEstimatesFromBlockcypherApi('test3')]);
}

type FetchAllBitcoinFeeEstimatesResp = Awaited<
  ReturnType<ReturnType<typeof fetchAllBitcoinFeeEstimates>>
>;

export function useGetAllBitcoinFeeEstimatesQuery<
  T extends unknown = FetchAllBitcoinFeeEstimatesResp,
>(options?: AppUseQueryConfig<FetchAllBitcoinFeeEstimatesResp, T>) {
  const client = useBitcoinClient();
  const network = useCurrentNetwork();

  return useQuery({
    queryKey: ['average-bitcoin-fee-estimates', network.chain.bitcoin.bitcoinNetwork],
    queryFn: fetchAllBitcoinFeeEstimates(client, network.chain.bitcoin.bitcoinNetwork),
    refetchInterval: 2000 * 60,
    ...options,
  });
}

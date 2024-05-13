import { useQuery } from '@tanstack/react-query';

import type { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RunesOutputsByAddress } from '../bitcoin-client';
import { useRunesEnabled } from './runes.hooks';

const queryOptions = { staleTime: 5 * 60 * 1000 };

export function useGetRunesOutputsByAddressQuery<T extends unknown = RunesOutputsByAddress[]>(
  address: string,
  options?: AppUseQueryConfig<RunesOutputsByAddress[], T>
) {
  const client = useBitcoinClient();
  const runesEnabled = useRunesEnabled();
  const network = useCurrentNetwork();

  return useQuery({
    enabled: !!address && runesEnabled,
    queryKey: ['runes-outputs-by-address', address],
    queryFn: ({ signal }) =>
      client.bestinSlotApi.getRunesOutputsByAddress({
        address,
        network: network.chain.bitcoin.bitcoinNetwork,
        signal,
      }),
    ...queryOptions,
    ...options,
  });
}

import { useQuery } from '@tanstack/react-query';

import type { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RunesOutputsByAddress } from '../bitcoin-client';
import { useRunesEnabled } from './runes.hooks';

export function useGetRunesOutputsByAddressQuery<T extends unknown = RunesOutputsByAddress[]>(
  address: string,
  options?: AppUseQueryConfig<RunesOutputsByAddress[], T>
) {
  const client = useBitcoinClient();
  const runesEnabled = useRunesEnabled();
  const network = useCurrentNetwork();

  return useQuery({
    queryKey: ['runes-outputs-by-address', address],
    queryFn: () =>
      client.bestinSlotApi.getRunesOutputsByAddress({
        address,
        network: network.chain.bitcoin.bitcoinNetwork,
      }),
    staleTime: 1000 * 60,
    enabled: !!address && runesEnabled,
    ...options,
  });
}

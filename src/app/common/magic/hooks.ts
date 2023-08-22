import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { initMagicClient } from '.';

export function useMagicClient() {
  const network = useCurrentNetworkState();
  const client = initMagicClient({ network: network.id });

  return client;
}

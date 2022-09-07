import { useMemo } from 'react';

import { apiClients, createConfig } from '@app/store/common/api-clients';

import { useCurrentNetworkState } from '../networks/networks.hooks';

// Unanchored by default (microblocks)
export function useApi() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createConfig(network.url);
    return apiClients(config);
  }, [network.url]);
}

// Anchored (NON-microblocks)
export function useAnchoredApi() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createConfig(network.url, true);
    return apiClients(config);
  }, [network.url]);
}

export type Api = ReturnType<typeof useApi>;

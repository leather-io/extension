import { useMemo } from 'react';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { getBitcoinNetwork } from '../network';

export function useBitcoinNetwork() {
  const network = useCurrentNetworkState();

  const bitcoinNetwork = useMemo(() => {
    return getBitcoinNetwork(network.id);
  }, [network]);

  return bitcoinNetwork;
}

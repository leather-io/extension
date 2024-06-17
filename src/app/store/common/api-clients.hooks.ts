import { useMemo } from 'react';

import { bitcoinClient, stacksClient } from '@leather-wallet/query';

import { useCurrentNetworkState } from '../networks/networks.hooks';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();
  return bitcoinClient(network.chain.bitcoin.bitcoinUrl);
}

export function useStacksClient() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    return stacksClient(network.chain.stacks.url);
  }, [network.chain.stacks.url]);
}

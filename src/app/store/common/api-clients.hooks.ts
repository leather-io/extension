import { useMemo } from 'react';

import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { createStacksAnchoredConfig, createStacksUnanchoredConfig } from '@app/query/stacks/utils';

import { useCurrentNetworkState } from '../networks/networks.hooks';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();
  return new BitcoinClient(network.chain.bitcoin.network);
}

// Unanchored by default (microblocks)
export function useStacksClientUnanchored() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksUnanchoredConfig(network.chain.stacks.url);
    return new StacksClient(config);
  }, [network.chain.stacks.url]);
}

// Anchored (NON-microblocks)
export function useStacksClientAnchored() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksAnchoredConfig(network.chain.stacks.url);
    return new StacksClient(config);
  }, [network.chain.stacks.url]);
}

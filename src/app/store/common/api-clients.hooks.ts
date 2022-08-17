import { useMemo } from 'react';

import { whenChainId } from '@app/common/utils';
import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { createStacksAnchoredConfig, createStacksUnanchoredConfig } from '@app/query/stacks/utils';
import { BITCOIN_API_BASE_URL_MAINNET, BITCOIN_API_BASE_URL_TESTNET } from '@shared/constants';

import { useCurrentNetworkState } from '../networks/networks.hooks';
import { ChainID } from '@stacks/transactions';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();

  const baseUrl = whenChainId(network.chainId)({
    [ChainID.Mainnet]: BITCOIN_API_BASE_URL_MAINNET,
    [ChainID.Testnet]: BITCOIN_API_BASE_URL_TESTNET,
  });

  return new BitcoinClient(baseUrl);
}

// Unanchored by default (microblocks)
export function useStacksClient() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksUnanchoredConfig(network.url);
    return new StacksClient(config);
  }, [network.url]);
}

// Anchored (NON-microblocks)
export function useStacksClientAnchored() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksAnchoredConfig(network.url);
    return new StacksClient(config);
  }, [network.url]);
}

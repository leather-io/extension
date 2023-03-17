import { useMemo } from 'react';

import { ChainID } from '@stacks/transactions';

import {
  BITCOIN_API_BASE_URL_MAINNET,
  BITCOIN_API_BASE_URL_TESTNET,
  TOKEN_METADATA_API_BASE_URL_MAINNET,
  TOKEN_METADATA_API_BASE_URL_TESTNET,
} from '@shared/constants';

import { whenStxChainId } from '@app/common/utils';
import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { TokenMetadataClient } from '@app/query/stacks/token-metadata-client';
import {
  createStacksAnchoredConfig,
  createStacksUnanchoredConfig,
  createTokenMetadataConfig,
} from '@app/query/stacks/utils';

import { useCurrentNetworkState } from '../networks/networks.hooks';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();

  const baseUrl = whenStxChainId(network.chain.stacks.chainId)({
    [ChainID.Mainnet]: BITCOIN_API_BASE_URL_MAINNET,
    [ChainID.Testnet]: BITCOIN_API_BASE_URL_TESTNET,
  });

  return new BitcoinClient(baseUrl);
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

export function useTokenMetadataClient() {
  const network = useCurrentNetworkState();

  const basePath = whenStxChainId(network.chain.stacks.chainId)({
    [ChainID.Mainnet]: TOKEN_METADATA_API_BASE_URL_MAINNET,
    [ChainID.Testnet]: TOKEN_METADATA_API_BASE_URL_TESTNET,
  });

  const config = createTokenMetadataConfig(basePath);

  return new TokenMetadataClient(config);
}

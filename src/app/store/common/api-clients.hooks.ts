import { useMemo } from 'react';

import { ChainID } from '@stacks/transactions';

import { HIRO_API_BASE_URL_MAINNET, HIRO_API_BASE_URL_TESTNET } from '@shared/constants';

import { whenStacksChainId } from '@app/common/utils';
import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { TokenMetadataClient } from '@app/query/stacks/token-metadata-client';
import { createStacksClientConfig, createTokenMetadataConfig } from '@app/query/stacks/utils';

import { useCurrentNetworkState } from '../networks/networks.hooks';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();
  return new BitcoinClient(network.chain.bitcoin.bitcoinUrl);
}

export function useStacksClient() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksClientConfig(network.chain.stacks.url);
    return new StacksClient(config);
  }, [network.chain.stacks.url]);
}

export function useTokenMetadataClient() {
  const currentNetwork = useCurrentNetworkState();

  const basePath = whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: HIRO_API_BASE_URL_MAINNET,
    [ChainID.Testnet]: HIRO_API_BASE_URL_TESTNET,
  });

  const config = createTokenMetadataConfig(basePath);

  return new TokenMetadataClient(config);
}

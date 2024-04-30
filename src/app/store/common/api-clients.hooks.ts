import { useMemo } from 'react';

import { wrappedFetch as fetchApi } from '@app/common/api/fetch-wrapper';
import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
import { StacksClient } from '@app/query/stacks/stacks-client';

import { useCurrentNetworkState } from '../networks/networks.hooks';

export function useBitcoinClient() {
  const network = useCurrentNetworkState();
  return new BitcoinClient(network.chain.bitcoin.bitcoinUrl);
}

export function useStacksClient() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    return new StacksClient({
      basePath: network.chain.stacks.url,
      fetchApi,
    });
  }, [network.chain.stacks.url]);
}

import { useMemo } from 'react';
import { ChainID } from '@stacks/transactions';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';

type Modes = 'testnet' | 'mainnet';

export function useCurrentNetwork() {
  const network = useCurrentNetworkState();
  const isTestnet = useMemo(() => network.chainId === ChainID.Testnet, [network.chainId]);
  const mode = (isTestnet ? 'testnet' : 'mainnet') as Modes;
  return { ...network, isTestnet, mode };
}

import { useMemo } from 'react';

import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

import { DefaultNetworkModes } from '@shared/constants';

import { initialSearchParams } from '@app/common/initial-search-params';
import { whenStxChainId } from '@app/common/utils';
import { useAppDispatch } from '@app/store';

import { networksActions } from './networks.actions';
import { useCurrentNetwork, useNetworks } from './networks.selectors';
import { PersistedNetworkConfiguration } from './networks.slice';
import { findMatchingNetworkKey } from './networks.utils';

export function useCurrentNetworkState() {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
    const mode = isTestnet ? DefaultNetworkModes.testnet : DefaultNetworkModes.mainnet;
    return { ...currentNetwork, isTestnet, mode };
  }, [currentNetwork]);
}

export function useCurrentStacksNetworkState(): StacksNetwork {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    if (!currentNetwork) throw new Error('No current network');

    const stacksNetwork = whenStxChainId(currentNetwork.chain.stacks.chainId || 1)({
      [ChainID.Mainnet]: new StacksMainnet({ url: currentNetwork.chain.stacks.url }),
      [ChainID.Testnet]: new StacksTestnet({ url: currentNetwork.chain.stacks.url }),
    });

    stacksNetwork.bnsLookupUrl = currentNetwork.chain.stacks.url || '';
    return stacksNetwork;
  }, [currentNetwork]);
}

export function useNetworksActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      addNetwork({ chainId, id, name, url }: PersistedNetworkConfiguration) {
        dispatch(networksActions.addNetwork({ chainId, id, name, url }));
        dispatch(networksActions.changeNetwork(id));
        return;
      },
      changeNetwork(id: string) {
        return dispatch(networksActions.changeNetwork(id));
      },
      removeNetwork(id: string) {
        return dispatch(networksActions.removeNetwork(id));
      },
    }),
    [dispatch]
  );
}

export function useRequestNetworkId() {
  const networks = useNetworks();

  return useMemo(() => {
    const coreApiUrl = initialSearchParams.get('coreApiUrl');
    const networkChainId = initialSearchParams.get('networkChainId');
    return findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  }, [networks]);
}

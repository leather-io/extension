import { useMemo } from 'react';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

import { whenChainId } from '@app/common/utils';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';
import { DefaultNetworkModes, NetworkConfiguration } from '@shared/constants';
import { useAppDispatch } from '@app/store';

import { useCurrentNetwork, useNetworks } from './networks.selectors';
import { networksActions } from './networks.actions';
import { findMatchingNetworkKey } from './networks.utils';

export function useCurrentNetworkState() {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    const isTestnet = currentNetwork?.chainId === ChainID.Testnet;
    const mode = isTestnet ? DefaultNetworkModes.testnet : DefaultNetworkModes.mainnet;
    return { ...currentNetwork, isTestnet, mode };
  }, [currentNetwork]);
}

export function useCurrentStacksNetworkState(): StacksNetwork {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    if (!currentNetwork) throw new Error('No current network');

    const stacksNetwork = whenChainId(currentNetwork.chainId || 1)({
      [ChainID.Mainnet]: new StacksMainnet({ url: currentNetwork.url }),
      [ChainID.Testnet]: new StacksTestnet({ url: currentNetwork.url }),
    });

    stacksNetwork.bnsLookupUrl = currentNetwork.url || '';
    return stacksNetwork;
  }, [currentNetwork]);
}

export function useNetworksActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      addNetwork({ chainId, id, name, url }: NetworkConfiguration) {
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
  const params = useInitialRouteSearchParams();

  return useMemo(() => {
    const coreApiUrl = params.get('coreApiUrl');
    const networkChainId = params.get('networkChainId');
    return findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  }, [networks, params]);
}

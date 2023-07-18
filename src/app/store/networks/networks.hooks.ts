import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StacksNetwork } from '@stacks/network';
import { ChainID, TransactionVersion } from '@stacks/transactions';

import { NetworkModes } from '@shared/constants';

import { whenStacksChainId } from '@app/common/utils';
import { useAppDispatch } from '@app/store';

import { networksActions } from './networks.actions';
import { selectAppRequestedNetworkId, useCurrentNetwork } from './networks.selectors';
import { PersistedNetworkConfiguration } from './networks.slice';

export function useCurrentNetworkState() {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
    const mode = (isTestnet ? 'testnet' : 'mainnet') as NetworkModes;
    return { ...currentNetwork, isTestnet, mode };
  }, [currentNetwork]);
}

export function useCurrentStacksNetworkState(): StacksNetwork {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    if (!currentNetwork) throw new Error('No current network');

    // todo: these params could be added to the constructor in stacks.js
    const stacksNetwork = new StacksNetwork({ url: currentNetwork.chain.stacks.url });
    stacksNetwork.version = whenStacksChainId(currentNetwork.chain.stacks.chainId)({
      [ChainID.Mainnet]: TransactionVersion.Mainnet,
      [ChainID.Testnet]: TransactionVersion.Testnet,
    });

    // Use actual chainId on network object, since it's used for signing
    stacksNetwork.chainId =
      currentNetwork.chain.stacks.subnetChainId ?? currentNetwork.chain.stacks.chainId;

    stacksNetwork.bnsLookupUrl = currentNetwork.chain.stacks.url || '';
    return stacksNetwork;
  }, [currentNetwork]);
}

export function useNetworksActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      addNetwork({ chainId, subnetChainId, id, name, url }: PersistedNetworkConfiguration) {
        dispatch(networksActions.addNetwork({ chainId, subnetChainId, id, name, url }));
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

export function useAppRequestedNetworkId() {
  return useSelector(selectAppRequestedNetworkId);
}

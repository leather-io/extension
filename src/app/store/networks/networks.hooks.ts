import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StacksNetwork } from '@stacks/network';
import { ChainID, TransactionVersion } from '@stacks/transactions';

import { HIRO_API_BASE_URL_NAKAMOTO_TESTNET, type NetworkModes } from '@leather-wallet/models';

import { whenStacksChainId } from '@shared/crypto/stacks/stacks.utils';

import { useAppDispatch } from '@app/store';

import { networksActions } from './networks.actions';
import { selectAppRequestedNetworkId, useCurrentNetwork } from './networks.selectors';
import { PersistedNetworkConfiguration } from './networks.slice';

export function useCurrentNetworkState() {
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => {
    const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
    const isNakamotoTestnet =
      currentNetwork.chain.stacks.url === HIRO_API_BASE_URL_NAKAMOTO_TESTNET;
    const mode = (isTestnet ? 'testnet' : 'mainnet') as NetworkModes;
    return { ...currentNetwork, isTestnet, isNakamotoTestnet, mode };
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
      addNetwork({
        id,
        name,
        chainId,
        subnetChainId,
        url,
        bitcoinNetwork,
        bitcoinUrl,
      }: PersistedNetworkConfiguration) {
        dispatch(
          networksActions.addNetwork({
            id,
            name,
            chainId,
            subnetChainId,
            url,
            bitcoinNetwork,
            bitcoinUrl,
          })
        );
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

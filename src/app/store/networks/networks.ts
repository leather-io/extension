import { atom } from 'jotai';

import { type NetworkConfiguration, defaultCurrentNetwork } from '@leather.io/models';

import { initialSearchParams } from '@app/common/initial-search-params';

import { storeAtom } from '..';
import { selectCurrentNetworkId, selectNetworks } from './networks.selectors';
import { findMatchingNetworkKey } from './networks.utils';

/** @deprecated */
export const currentNetworkAtom = atom(get => {
  const store = get(storeAtom);
  const coreApiUrl = initialSearchParams.get('coreApiUrl');
  const networkChainId = initialSearchParams.get('networkChainId');
  const networkMode = initialSearchParams.get('network');

  const networks: Record<string, NetworkConfiguration> = selectNetworks(store);

  if (networkMode) return networks[networkMode] ?? defaultCurrentNetwork;

  const currentNetworkId = selectCurrentNetworkId(store);

  const requestNetworkId = findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  return networks[requestNetworkId || currentNetworkId] ?? defaultCurrentNetwork;
});

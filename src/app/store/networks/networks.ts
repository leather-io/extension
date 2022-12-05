import { Dictionary } from '@reduxjs/toolkit';
import { atom } from 'jotai';

import { NetworkConfiguration, defaultCurrentNetwork } from '@shared/constants';

import { initialSearchParams } from '@app/common/initial-search-params';

import { storeAtom } from '..';
import { selectCurrentNetworkId, selectNetworks } from './networks.selectors';
import { findMatchingNetworkKey } from './networks.utils';

export const currentNetworkAtom = atom(get => {
  const store = get(storeAtom);
  const coreApiUrl = initialSearchParams.get('coreApiUrl');
  const networkChainId = initialSearchParams.get('networkChainId');

  const currentNetworkId = selectCurrentNetworkId(store);
  const networks: Dictionary<NetworkConfiguration> = selectNetworks(store);

  const requestNetworkId = findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  return networks[requestNetworkId || currentNetworkId] ?? defaultCurrentNetwork;
});

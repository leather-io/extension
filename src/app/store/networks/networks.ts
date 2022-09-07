import { atom } from 'jotai';
import { Dictionary } from '@reduxjs/toolkit';

import { initialRouteSearchParams } from '@app/store/common/initial-route-search-params';
import { defaultCurrentNetwork, Network } from '@shared/constants';

import { storeAtom } from '..';
import { selectCurrentNetworkId, selectNetworks } from './networks.selectors';
import { findMatchingNetworkKey } from './networks.utils';

export const currentNetworkAtom = atom(get => {
  const store = get(storeAtom);
  const params = get(initialRouteSearchParams);
  const coreApiUrl = params.get('coreApiUrl');
  const networkChainId = params.get('networkChainId');

  const currentNetworkId = selectCurrentNetworkId(store);
  const networks: Dictionary<Network> = selectNetworks(store);

  const requestNetworkId = findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  return networks[requestNetworkId || currentNetworkId] ?? defaultCurrentNetwork;
});

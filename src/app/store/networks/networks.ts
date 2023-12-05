import { Dictionary } from '@reduxjs/toolkit';
import { atom } from 'jotai';

import { NetworkConfiguration, defaultCurrentNetwork } from '@shared/constants';

import { initialSearchParams } from '@app/common/initial-search-params';

import { storeAtom } from '..';
import { selectCurrentNetworkId, selectNetworks } from './networks.selectors';
import { findMatchingNetworkKey } from './networks.utils';

// TODO as about this as it's depreacted but not sure what to do instead
// PR https://github.com/leather-wallet/extension/pull/3017
/** @deprecated */
export const currentNetworkAtom = atom(get => {
  const store = get(storeAtom);
  const coreApiUrl = initialSearchParams.get('coreApiUrl');
  const networkChainId = initialSearchParams.get('networkChainId');
  const networkMode = initialSearchParams.get('network');

  const networks: Dictionary<NetworkConfiguration> = selectNetworks(store);

  if (networkMode) return networks[networkMode] ?? defaultCurrentNetwork;

  const currentNetworkId = selectCurrentNetworkId(store);

  const requestNetworkId = findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
  return networks[requestNetworkId || currentNetworkId] ?? defaultCurrentNetwork;
});

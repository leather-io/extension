import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import {
  type NetworkConfiguration,
  defaultCurrentNetwork,
  defaultNetworksKeyedById,
} from '@leather.io/models';

import { initialSearchParams } from '@app/common/initial-search-params';
import { RootState } from '@app/store';

import { useAppRequestedNetworkId } from './networks.hooks';
import { networksAdapter } from './networks.slice';
import {
  findMatchingNetworkKey,
  transformNetworkStateToMultichainStucture,
} from './networks.utils';

const selectNetworksSlice = (state: RootState) => state.networks;

const networksSelectors = networksAdapter.getSelectors<RootState>(selectNetworksSlice);

export const selectNetworks = createSelector(
  networksSelectors.selectEntities,
  state =>
    ({
      ...defaultNetworksKeyedById,
      ...transformNetworkStateToMultichainStucture(state),
    }) as Record<string, NetworkConfiguration>
);

export const selectCurrentNetworkId = createSelector(
  selectNetworksSlice,
  state => state.currentNetworkId
);

export const selectAppRequestedNetworkId = createSelector(selectNetworks, networks => {
  // CoreAPI URL and networkChainId are from legacy Stacks transactions
  const coreApiUrl = initialSearchParams.get('coreApiUrl');
  const networkChainId = initialSearchParams.get('networkChainId');
  // `network` param is a more generic network selector that doesn't deal with
  // custom networks
  const network = initialSearchParams.get('network');
  if (network && networks[network]?.id) return networks[network]?.id;

  return findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
});

export const selectCurrentNetwork = createSelector(
  selectNetworks,
  selectCurrentNetworkId,
  selectAppRequestedNetworkId,
  (networks, currentNetworkId, appRequestedNetworkId) =>
    networks[appRequestedNetworkId || currentNetworkId] ?? defaultCurrentNetwork
);

export function useNetworks(): Record<string, NetworkConfiguration> {
  return useSelector(selectNetworks);
}

export function useCurrentNetworkId() {
  const requestNetworkId = useAppRequestedNetworkId();
  const currentNetworkId = useSelector(selectCurrentNetworkId);
  return requestNetworkId ?? currentNetworkId;
}

export function useCurrentNetwork(): NetworkConfiguration {
  return useSelector(selectCurrentNetwork);
}

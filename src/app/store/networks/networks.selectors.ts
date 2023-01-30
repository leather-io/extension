import { useSelector } from 'react-redux';

import { Dictionary, createSelector } from '@reduxjs/toolkit';

import {
  NetworkConfiguration,
  defaultCurrentNetwork,
  defaultNetworksKeyedById,
} from '@shared/constants';

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
    } as Dictionary<NetworkConfiguration>)
);

export const selectCurrentNetworkId = createSelector(
  selectNetworksSlice,
  state => state.currentNetworkId
);

export const selectAppRequestedNetworkId = createSelector(selectNetworks, networks => {
  const coreApiUrl = initialSearchParams.get('coreApiUrl');
  const networkChainId = initialSearchParams.get('networkChainId');
  return findMatchingNetworkKey({ coreApiUrl, networkChainId, networks });
});

export const selectCurrentNetwork = createSelector(
  selectNetworks,
  selectCurrentNetworkId,
  (networks, currentNetworkId) => networks[currentNetworkId] ?? defaultCurrentNetwork
);

export function useNetworks(): Dictionary<NetworkConfiguration> {
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

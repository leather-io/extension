import { useSelector } from 'react-redux';

import { Dictionary, createSelector } from '@reduxjs/toolkit';

import {
  NetworkConfiguration,
  defaultCurrentNetwork,
  defaultNetworksKeyedById,
} from '@shared/constants';

import { RootState } from '@app/store';

import { useRequestNetworkId } from './networks.hooks';
import { networksAdapter } from './networks.slice';
import { transformNetworkStateToMultichainStucture } from './networks.utils';

const selectNetworksSlice = (state: RootState) => state.networks;

const networksSelectors = networksAdapter.getSelectors<RootState>(selectNetworksSlice);

export const selectNetworks = createSelector(networksSelectors.selectEntities, state => ({
  ...defaultNetworksKeyedById,
  ...transformNetworkStateToMultichainStucture(state),
}));

export const selectCurrentNetworkId = createSelector(
  selectNetworksSlice,
  state => state.currentNetworkId
);

export function useNetworks(): Dictionary<NetworkConfiguration> {
  return useSelector(selectNetworks);
}

export function useCurrentNetworkId() {
  const requestNetworkId = useRequestNetworkId();
  const currentNetworkId = useSelector(selectCurrentNetworkId);
  return requestNetworkId ?? currentNetworkId;
}

export function useCurrentNetwork(): NetworkConfiguration {
  const networks = useNetworks();
  const networkId = useCurrentNetworkId();
  return networks[networkId] ?? defaultCurrentNetwork;
}

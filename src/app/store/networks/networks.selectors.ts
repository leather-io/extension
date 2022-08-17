import { useSelector } from 'react-redux';
import { createSelector, Dictionary } from '@reduxjs/toolkit';

import {
  defaultCurrentNetwork,
  defaultNetworksKeyedById,
  NetworkConfiguration,
} from '@shared/constants';
import { RootState } from '@app/store';

import { networksAdapter } from './networks.slice';
import { useRequestNetworkId } from './networks.hooks';

const selectNetworksSlice = (state: RootState) => state.networks;

const networksSelectors = networksAdapter.getSelectors<RootState>(selectNetworksSlice);

export const selectNetworks = createSelector(networksSelectors.selectEntities, state => ({
  ...defaultNetworksKeyedById,
  ...state,
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

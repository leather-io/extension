import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { DefaultNetworkConfigurationIds, NetworkConfiguration } from '@shared/constants';

const defaultCurrentNetworkId = DefaultNetworkConfigurationIds.mainnet as EntityId;

export const networksAdapter = createEntityAdapter<NetworkConfiguration>();

const initialNetworksState = networksAdapter.getInitialState({
  currentNetworkId: defaultCurrentNetworkId,
});

export const networksSlice = createSlice({
  name: 'networks',
  initialState: initialNetworksState,
  reducers: {
    addNetwork(state, action: PayloadAction<NetworkConfiguration>) {
      networksAdapter.addOne(state, action.payload);
    },
    changeNetwork(state, action: PayloadAction<EntityId>) {
      state.currentNetworkId = action.payload;
    },
    removeNetwork(state, action: PayloadAction<EntityId>) {
      networksAdapter.removeOne(state, action.payload);
    },
  },
});

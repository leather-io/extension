import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';

import { DefaultNetworkIds, Network } from '@shared/constants';

const defaultCurrentNetworkId = DefaultNetworkIds.mainnet as EntityId;

export const networksAdapter = createEntityAdapter<Network>();

const initialNetworksState = networksAdapter.getInitialState({
  currentNetworkId: defaultCurrentNetworkId,
});

export const networksSlice = createSlice({
  name: 'networks',
  initialState: initialNetworksState,
  reducers: {
    addNetwork(state, action: PayloadAction<Network>) {
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

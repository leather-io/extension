import { combineReducers, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultKeyId } from '../keys/key.slice';

interface PendingBrc20Transfer {
  id: string;
  recipient: string;
  amount: number;
  status: 'pending' | 'ready';
}

const ordinalsAdapter = createEntityAdapter<PendingBrc20Transfer>();

const ordinalSliceDefaultWallet = createSlice({
  name: 'ordinals',
  initialState: ordinalsAdapter.getInitialState(),
  reducers: {
    brc20TransferInitiated: ordinalsAdapter.addOne,
    brc20TransferCompleted: ordinalsAdapter.removeOne,
  },
});

export const { brc20TransferInitiated } = ordinalSliceDefaultWallet.actions;

// Nesting under default key id to support multiple wallets in future without
// needing to migrate persisted store
export const ordinalsReducer = combineReducers({
  [defaultKeyId]: ordinalSliceDefaultWallet.reducer,
});

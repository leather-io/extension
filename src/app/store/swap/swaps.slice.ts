import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Swap } from '@app/common/swaps';
import { MagicInboundSwap } from '@app/common/magic/models';

const swapsAdapter = createEntityAdapter<Swap>();

export const swapsInitialState = swapsAdapter.getInitialState();

export const swapsSlice = createSlice({
  name: 'swaps',
  initialState: swapsInitialState,
  reducers: {
    createInboundMagicSwap(state, action: PayloadAction<MagicInboundSwap>) {
      swapsAdapter.addOne(state, {
        type: 'magic',
        direction: 'inbound',
        ...action.payload
      });
    },
  },
});

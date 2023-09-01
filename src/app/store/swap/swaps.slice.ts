import { Swap } from "@app/common/swaps";
import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const swapsAdapter = createEntityAdapter<Swap>();

export const swapsInitialState = swapsAdapter.getInitialState();

export const swapsSlice = createSlice({
  name: 'swaps',
  initialState: swapsInitialState,
  reducers: {
    createSwap(state, action: PayloadAction<Swap>) {
      swapsAdapter.addOne(state, action.payload);
    }
  }
});

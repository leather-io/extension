import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChainID } from '@stacks/common';

interface AnalyticsState {
  hasStxDeposits: {
    [ChainID.Mainnet]: boolean;
    [ChainID.Testnet]: boolean;
  };
}

const initialState: AnalyticsState = {
  hasStxDeposits: {
    [ChainID.Mainnet]: true,
    [ChainID.Testnet]: true,
  },
};

interface DepositByNetwork {
  hasStxDeposits: boolean;
  network: ChainID;
}

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    hasStxDeposits(state, action: PayloadAction<DepositByNetwork>) {
      const { network, hasStxDeposits } = action.payload;
      state.hasStxDeposits[network] = hasStxDeposits;
    },
  },
});

import { useSelector } from 'react-redux';

import { PayloadAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '..';

interface TokenUserSetting {
  id: string;
  enabled: boolean;
  accountIndex: number;
}

const manageTokensAdapter = createEntityAdapter<TokenUserSetting>();

export const manageTokensSlice = createSlice({
  name: 'manageTokens',
  initialState: manageTokensAdapter.getInitialState(),
  reducers: {
    userTogglesTokenVisibility(
      state,
      action: PayloadAction<{ id: string; enabled: boolean; accountIndex: number }>
    ) {
      manageTokensAdapter.setOne(state, {
        id: action.payload.id,
        enabled: action.payload.enabled,
        accountIndex: action.payload.accountIndex,
      });
    },
    removeAllTokens(state) {
      manageTokensAdapter.removeAll(state);
    },
  },
});

const selectors = manageTokensAdapter.getSelectors();

function selectTokenState(state: RootState) {
  return state.manageTokens;
}

const selectAllTokens = createSelector(selectTokenState, selectors.selectAll);

export function useUserAllTokens() {
  return useSelector(selectAllTokens);
}

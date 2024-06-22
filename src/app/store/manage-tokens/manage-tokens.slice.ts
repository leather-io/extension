import { useSelector } from 'react-redux';

import { PayloadAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '..';

export interface IManageTokens {
  id: string;
  enabled: boolean;
  accountIndex: number;
}

const manageTokensAdapter = createEntityAdapter<IManageTokens>();

export const manageTokensSlice = createSlice({
  name: 'manageTokens',
  initialState: manageTokensAdapter.getInitialState(),
  reducers: {
    setToken(state, action: PayloadAction<{ id: string; enabled: boolean; accountIndex: number }>) {
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

export const { setToken, removeAllTokens } = manageTokensSlice.actions;

const selectors = manageTokensAdapter.getSelectors();

function selectTokenState(state: RootState) {
  return state.manageTokens;
}

export const selectAllTokens = createSelector(selectTokenState, selectors.selectAll);
export const selectTokenEntities = createSelector(selectTokenState, selectors.selectEntities);

export const selectEnabledTokens = createSelector(selectAllTokens, tokens =>
  tokens.filter(token => token.enabled)
);

export const selectDisabledTokens = createSelector(selectAllTokens, tokens =>
  tokens.filter(token => !token.enabled)
);

export function useEnabledTokens() {
  return useSelector(selectEnabledTokens);
}

export function useDisabledTokens() {
  return useSelector(selectDisabledTokens);
}

export function useAllTokens() {
  return useSelector(selectAllTokens);
}

export function useTokenEntities() {
  return useSelector(selectTokenEntities);
}

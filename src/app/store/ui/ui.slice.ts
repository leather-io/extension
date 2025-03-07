import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { broadcasting: false, loading: false, submitted: false },
  reducers: {
    setBroadcasting: (state, action) => {
      state.broadcasting = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubmitted: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const selectUiSlice = (state: RootState) => state.ui;
const uiActions = uiSlice.actions;

export function useUiState() {
  const selectBroadcasting = createSelector(selectUiSlice, state => state.broadcasting);
  const selectLoading = createSelector(selectUiSlice, state => state.loading);
  const selectSubmitted = createSelector(selectUiSlice, state => state.submitted);
  return {
    isBroadcasting: useSelector(selectBroadcasting),
    isLoading: useSelector(selectLoading),
    isSubmitted: useSelector(selectSubmitted),
  };
}

export function useUiActions() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      setBroadcasting(value: boolean) {
        return dispatch(uiActions.setBroadcasting(value));
      },
      setLoading(value: boolean) {
        return dispatch(uiActions.setLoading(value));
      },
      setSubmitted(value: boolean) {
        return dispatch(uiActions.setSubmitted(value));
      },
    }),
    [dispatch]
  );
}

import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectSettings = (state: RootState) => state.settings;

const selectUserSelectedTheme = createSelector(selectSettings, state => state.userSelectedTheme);

export function useUserSelectedTheme() {
  return useSelector(selectUserSelectedTheme);
}

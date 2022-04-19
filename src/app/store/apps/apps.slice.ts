import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface AppDetails {
  domain: string;
}

const appsAdapter = createEntityAdapter<AppDetails>({
  selectId: entity => entity.domain,
});

export const appsSlice = createSlice({
  name: 'apps',
  initialState: appsAdapter.getInitialState(),
  reducers: {
    appConnected: appsAdapter.addOne,
  },
});

const selectApps = (state: RootState) => state.apps;

const appsSelectors = appsAdapter.getSelectors(selectApps);

export const selectAllowedDomains = appsSelectors.selectAll;

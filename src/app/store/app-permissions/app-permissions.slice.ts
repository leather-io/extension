import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

interface AppPermission {
  origin: string;
  // Very simple permission system. If property exists with date, user
  // has given permission
  requestedAccounts?: string;
}

const appPermissionsAdapter = createEntityAdapter<AppPermission>({
  selectId: permission => permission.origin,
});

const initialState = appPermissionsAdapter.getInitialState();

export const appPermissionsSlice = createSlice({
  name: 'appPermissions',
  initialState,
  reducers: { updatePermission: appPermissionsAdapter.upsertOne },
});

export function useAppPermissions() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      hasRequestedAccounts(origin: string) {
        dispatch(
          appPermissionsSlice.actions.updatePermission({
            origin,
            requestedAccounts: new Date().toISOString(),
          })
        );
      },
    }),
    [dispatch]
  );
}

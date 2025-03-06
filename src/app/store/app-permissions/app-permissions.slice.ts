import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { BitcoinNetworkModes } from '@leather.io/models';

import { useCurrentAccountIndex } from '../accounts/account';
import { useCurrentNetwork } from '../networks/networks.selectors';

interface AppPermission {
  origin: string;
  // Very simple permission system. If property exists with date, user
  // has given permission
  requestedAccounts?: string;
  accountIndex: number;
  networkMode: BitcoinNetworkModes;
}
const appPermissionsAdapter = createEntityAdapter<AppPermission, string>({
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
  const currentAccountIndex = useCurrentAccountIndex();
  const currentNetwork = useCurrentNetwork();

  return useMemo(
    () => ({
      hasRequestedAccounts(origin: string) {
        const url = new URL(origin).hostname;
        dispatch(
          appPermissionsSlice.actions.updatePermission({
            origin: url,
            requestedAccounts: new Date().toISOString(),
            accountIndex: currentAccountIndex,
            networkMode: currentNetwork.chain.bitcoin.mode,
          })
        );
      },
    }),
    [currentAccountIndex, currentNetwork.chain.bitcoin.mode, dispatch]
  );
}

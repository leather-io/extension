import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectWalletSlice = (state: RootState) => state.keys;

export const selectGeneratedSecretKey = createSelector(selectWalletSlice, state => state.secretKey);

export const selectCurrentKey = createSelector(selectWalletSlice, state => state.entities.default);

export function withDerivedKeyInformation(key: ReturnType<typeof selectCurrentKey>) {
  return { ...key, hasSetPassword: !!key?.encryptedSecretKey };
}

export function useCurrentKey() {
  const currentKey = useSelector(selectCurrentKey);
  return useMemo(() => withDerivedKeyInformation(currentKey), [currentKey]);
}

export function useGeneratedSecretKey() {
  return useSelector(selectGeneratedSecretKey);
}

import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import type { Inscription } from '@leather.io/models';

import { RootState } from '@app/store';

import { settingsSlice } from './settings.slice';

const selectSettings = (state: RootState) => state.settings;

const selectUserSelectedTheme = createSelector(selectSettings, state => state.userSelectedTheme);

export function useUserSelectedTheme() {
  return useSelector(selectUserSelectedTheme);
}

const selectDismissedMessageIds = createSelector(
  selectSettings,
  state => state.dismissedMessages ?? []
);

export function useDismissedMessageIds() {
  return useSelector(selectDismissedMessageIds);
}

const selectIsPrivateMode = createSelector(selectSettings, state => state.isPrivateMode ?? false);

export function useIsPrivateMode() {
  return useSelector(selectIsPrivateMode);
}

const selectIsNotificationsEnabled = createSelector(
  selectSettings,
  state => state.isNotificationsEnabled ?? false
);

export function useIsNotificationsEnabled() {
  return useSelector(selectIsNotificationsEnabled);
}

const selectDiscardedInscriptions = createSelector(
  selectSettings,
  state => state.discardedInscriptions
);

type InscriptionIdentifier = Pick<Inscription, 'txid' | 'output' | 'offset'>;

export function useDiscardedInscriptions() {
  const discardedInscriptions = useSelector(selectDiscardedInscriptions);
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      discardedInscriptions,
      hasInscriptionBeenDiscarded({ txid, output: vout, offset }: InscriptionIdentifier) {
        return discardedInscriptions.includes([txid, vout, offset].join(':'));
      },
      discardInscription({ txid, output: vout, offset }: InscriptionIdentifier) {
        dispatch(settingsSlice.actions.discardInscription([txid, vout, offset].join(':')));
      },
      recoverInscription({ txid, output: vout, offset }: InscriptionIdentifier) {
        dispatch(settingsSlice.actions.recoverInscription([txid, vout, offset].join(':')));
      },
    }),
    [discardedInscriptions, dispatch]
  );
}

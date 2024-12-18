import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

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

const selectHasUserBypassedInscriptionChecks = createSelector(
  selectSettings,
  state => state.bypassInscriptionChecks ?? false
);

export function useHasUserBypassedInscriptionChecks() {
  return useSelector(selectHasUserBypassedInscriptionChecks);
}

const selectDiscardedInscriptions = createSelector(
  selectSettings,
  state => state.discardedInscriptions
);

export function useDiscardedInscriptions() {
  const discardedInscriptions = useSelector(selectDiscardedInscriptions);
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      discardedInscriptions,
      hasBeenDiscarded(inscriptionId: string) {
        return discardedInscriptions.includes(inscriptionId);
      },
      discardInscription(inscriptionId: string) {
        dispatch(settingsSlice.actions.discardInscription(inscriptionId));
      },
      recoverInscription(inscriptionId: string) {
        dispatch(settingsSlice.actions.recoverInscription(inscriptionId));
      },
    }),
    [discardedInscriptions, dispatch]
  );
}

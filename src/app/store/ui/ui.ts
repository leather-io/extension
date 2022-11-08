import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';

import { makeLocalDataKey } from '@app/common/store-utils';

export const tabState = atomFamily(param => {
  const anAtom = atomWithStorage<number>(makeLocalDataKey(['HOME_TABS', param]), 0);
  anAtom.debugLabel = `TABS__${param}`;
  return anAtom;
});

type LoadingState = 'idle' | 'loading';

export const loadingState = atomFamily(_param => {
  const anAtom = atom<LoadingState>('idle');
  anAtom.debugLabel = `loading-atom/${_param}`;
  return anAtom;
});

// TODO: refactor into atom family
export const showSwitchAccountsState = atom(false);

export const showHighFeeConfirmationState = atom(false);

export const showSettingsStore = atom(false);
export const showEditNonceState = atom(false);
export const showTxSettingsCallback = atom<(() => Promise<void>) | undefined>(undefined);

export const errorStackTraceState = atom<string | null>(null);

export const routeHeaderState = atom<JSX.Element | null>(null);

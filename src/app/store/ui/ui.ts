import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

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

export const showTxSettingsCallback = atom<(() => Promise<void>) | undefined>(undefined);

export const errorStackTraceState = atom<string | null>(null);

export const routeHeaderState = atom<React.JSX.Element | null>(null);

import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import {
  accountDrawerStep,
  errorStackTraceState,
  loadingState,
  showAccountsStore,
  showNetworksStore,
  showSettingsStore,
  tabState,
  showTxSettingsStore,
  showTxSettingsCallback,
  showEditNonceState,
  showSignOut,
} from './ui';
import { useEffect } from 'react';

// HACK: `ControlledDrawer` requires the state to be passed in to the component
// This goes against the pattern of only exposing an interface to the store
// via hooks, and couples the implementation details of the component tree and store
export { showNetworksStore, showAccountsStore, showTxSettingsStore };

export function useAccountDrawerStep() {
  return useAtom(accountDrawerStep);
}

export function useUpdateAccountDrawerStep() {
  return useUpdateAtom(accountDrawerStep);
}

export function useShowAccountsStore() {
  return useAtom(showAccountsStore);
}

export function useUpdateShowAccounts() {
  return useUpdateAtom(showAccountsStore);
}

export function useShowNetworksStore() {
  return useAtom(showNetworksStore);
}

export function useShowSettingsStore() {
  return useAtom(showSettingsStore);
}

export function useShowTxSettingsStore() {
  return useAtom(showTxSettingsStore);
}

export function useShowSignOut() {
  return useAtom(showSignOut);
}

export function useShowTxSettingsCallback() {
  return useAtom(showTxSettingsCallback);
}

export function useLoadingStore(key: string) {
  return useAtom(loadingState(key));
}

export function useTabState(key: string) {
  return useAtom(tabState(key));
}

export function useErrorStackTraceState() {
  return useAtom(errorStackTraceState);
}

export function useShowEditNonceState() {
  return useAtom(showEditNonceState);
}

export function useShowEditNonceCleanupEffect() {
  const [showNonce, setShowNonce] = useShowEditNonceState();
  useEffect(() => {
    return () => {
      if (showNonce) setShowNonce(false);
    };
  }, [showNonce, setShowNonce]);
}

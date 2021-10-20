import { useEffect } from 'react';
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
  showEditNonceState,
  showTxSettingsCallback,
  showSignOut,
} from './ui';

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

export function useShowEditNonceState() {
  return useAtom(showEditNonceState);
}

export function useShowSignOut() {
  return useAtom(showSignOut);
}

export function useShowTxSettingsCallback() {
  return useAtom(showTxSettingsCallback);
}

export function useLoadingState(key: string) {
  return useAtom(loadingState(key));
}

export function useTabState(key: string) {
  return useAtom(tabState(key));
}

export function useErrorStackTraceState() {
  return useAtom(errorStackTraceState);
}

export function useShowEditNonceCleanupEffect() {
  const [showNonce, setShowNonce] = useShowEditNonceState();
  useEffect(() => {
    return () => {
      if (showNonce) setShowNonce(false);
    };
  }, [showNonce, setShowNonce]);
}

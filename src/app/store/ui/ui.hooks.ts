import { useEffect } from 'react';

import { useAtom } from 'jotai';

import {
  errorStackTraceState,
  loadingState,
  routeHeaderState,
  showEditNonceState,
  showHighFeeConfirmationState,
  showSettingsStore,
  showSwitchAccountsState,
  showTxSettingsCallback,
  tabState,
} from './ui';

export function useShowHighFeeConfirmationState() {
  return useAtom(showHighFeeConfirmationState);
}

export function useShowSwitchAccountsState() {
  return useAtom(showSwitchAccountsState);
}

export function useShowSettingsStore() {
  return useAtom(showSettingsStore);
}

export function useShowEditNonceState() {
  return useAtom(showEditNonceState);
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

export function useRouteHeaderState() {
  return useAtom(routeHeaderState);
}

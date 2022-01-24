import { useMemo } from 'react';
import { Wallet } from '@stacks/wallet-sdk';

import { useAppDispatch } from '@app/store';
import { clearSessionLocalData } from '@app/common/store-utils';

import { createNewAccount, stxChainActions } from '@app/store/chains/stx-chain.actions';
import { keyActions } from '@app/store/keys/key.actions';
import { useAnalytics } from './analytics/use-analytics';

export function useKeyActions() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      async setPassword(password: string) {
        return dispatch(keyActions.setWalletEncryptionPassword(password));
      },

      generateWalletKey() {
        return dispatch(keyActions.generateWalletKey());
      },

      async unlockWallet(password: string) {
        return dispatch(keyActions.unlockWalletAction(password));
      },

      switchAccount(index: number) {
        return dispatch(stxChainActions.switchAccount(index));
      },

      async createNewAccount(wallet: Wallet) {
        return dispatch(createNewAccount(wallet));
      },

      async signOut() {
        void analytics.track('sign_out');
        dispatch(keyActions.signOut());
        clearSessionLocalData();
      },

      lockWallet() {
        return dispatch(keyActions.lockWallet());
      },
    }),
    [analytics, dispatch]
  );
}

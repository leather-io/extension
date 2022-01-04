import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Wallet } from '@stacks/wallet-sdk';

import { keySlice } from '@app/store/keys/key.slice';
import { useAnalytics } from './analytics/use-analytics';
import { clearSessionLocalData } from '@app/common/store-utils';
import { stxChainSlice } from '@app/store/chains/stx-chain.slice';
import { createNewAccount } from '@app/store/chains/stx-chain.actions';
import { setWalletEncryptionPassword, unlockWalletAction } from '@app/store/keys/keys.actions';

export function useKeyActions() {
  const analytics = useAnalytics();
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      async setPassword(password: string) {
        return dispatch(setWalletEncryptionPassword(password));
      },

      async unlockWallet(password: string) {
        return dispatch(unlockWalletAction(password));
      },

      switchAccount(index: number) {
        return dispatch(stxChainSlice.actions.switchAccount(index));
      },

      async createNewAccount(wallet: Wallet) {
        return dispatch(createNewAccount(wallet));
      },

      async signOut() {
        void analytics.track('sign_out');
        dispatch(keySlice.actions.signOut());
        clearSessionLocalData();
      },

      lockWallet() {
        return dispatch(keySlice.actions.lockWallet());
      },
    }),
    [analytics, dispatch]
  );
}

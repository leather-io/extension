import { useMemo } from 'react';
import { generateSecretKey, Wallet } from '@stacks/wallet-sdk';

import { useAppDispatch } from '@app/store';
import { clearSessionLocalData } from '@app/common/store-utils';

import { createNewAccount, stxChainActions } from '@app/store/chains/stx-chain.actions';
import { keyActions } from '@app/store/keys/key.actions';
import { useAnalytics } from './analytics/use-analytics';
import { sendMessage } from '@shared/messages';
import { InternalMethods } from '@shared/message-types';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';

export function useKeyActions() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      async setPassword(password: string) {
        return dispatch(keyActions.setWalletEncryptionPassword(password));
      },

      generateWalletKey() {
        const secretKey = generateSecretKey(256);
        sendMessage({
          method: InternalMethods.ShareInMemoryKeyToBackground,
          payload: { secretKey, keyId: 'default' },
        });
        return dispatch(inMemoryKeyActions.generateWalletKey(secretKey));
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
        sendMessage({ method: InternalMethods.RemoveInMemoryKeys, payload: undefined });
        dispatch(keyActions.signOut());
        clearSessionLocalData();
        void analytics.track('sign_out');
      },

      lockWallet() {
        sendMessage({ method: InternalMethods.RemoveInMemoryKeys, payload: undefined });
        return dispatch(inMemoryKeyActions.lockWallet());
      },
    }),
    [analytics, dispatch]
  );
}

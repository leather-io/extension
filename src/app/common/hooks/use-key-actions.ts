import { useMemo } from 'react';

import { generateSecretKey } from '@stacks/wallet-sdk';

import { logger } from '@shared/logger';
import { clearChromeStorage } from '@shared/storage/redux-pesist';

import { queryClient } from '@app/common/persistence';
import { partiallyClearLocalStorage } from '@app/common/store-utils';
import { useAppDispatch } from '@app/store';
import { createNewAccount, stxChainActions } from '@app/store/chains/stx-chain.actions';
import { useBitcoinClient, useStacksClientAnchored } from '@app/store/common/api-clients.hooks';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import { bitcoinKeysSlice } from '@app/store/ledger/bitcoin/bitcoin-key.slice';
import { stacksKeysSlice } from '@app/store/ledger/stacks/stacks-key.slice';
import { clearWalletSession } from '@app/store/session-restore';
import { keyActions } from '@app/store/software-keys/software-key.actions';
import { useCurrentKeyDetails } from '@app/store/software-keys/software-key.selectors';

import { useAnalytics } from './analytics/use-analytics';

export function useKeyActions() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  const defaultKeyDetails = useCurrentKeyDetails();
  const stxClient = useStacksClientAnchored();
  const btcClient = useBitcoinClient();

  return useMemo(
    () => ({
      async setPassword(password: string) {
        return dispatch(keyActions.setWalletEncryptionPassword({ password, stxClient, btcClient }));
      },

      generateWalletKey() {
        if (!!defaultKeyDetails) {
          logger.warn('Cannot generate new wallet when wallet already exists');
          return;
        }
        const secretKey = generateSecretKey(256);
        return dispatch(inMemoryKeyActions.generateWalletKey(secretKey));
      },

      async unlockWallet(password: string) {
        return dispatch(keyActions.unlockWalletAction(password));
      },

      switchAccount(index: number) {
        return dispatch(stxChainActions.switchAccount(index));
      },

      async createNewAccount() {
        return dispatch(createNewAccount());
      },

      async signOut() {
        await clearWalletSession();
        dispatch(keyActions.signOut());
        dispatch(bitcoinKeysSlice.actions.signOut());
        dispatch(stacksKeysSlice.actions.signOut());
        await clearChromeStorage();
        partiallyClearLocalStorage();
        void analytics.track('sign_out');
        queryClient.clear();
      },

      async lockWallet() {
        await clearWalletSession();
        return dispatch(inMemoryKeyActions.lockWallet());
      },
    }),
    [analytics, btcClient, defaultKeyDetails, dispatch, stxClient]
  );
}

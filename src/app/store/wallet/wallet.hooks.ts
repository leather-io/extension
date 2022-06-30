import { useCallback } from 'react';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  makeAuthResponse,
  updateWalletConfigWithApp,
} from '@stacks/wallet-sdk';

import { gaiaUrl } from '@shared/constants';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { currentAccountStxAddressState } from '@app/store/accounts';
import { localNonceState } from '@app/store/accounts/nonce';
import { currentNetworkState } from '@app/store/network/networks';
import { finalizeAuthResponse } from '@app/common/actions/finalize-auth-response';
import { logger } from '@shared/logger';
import { encryptedSecretKeyState, secretKeyState, walletState } from './wallet';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useWalletType } from '@app/common/use-wallet-type';
import { useAccounts } from '../accounts/account.hooks';

export function useWalletState() {
  return useAtomValue(walletState);
}

export function useSecretKey() {
  return useAtomValue(secretKeyState);
}

export function useEncryptedSecretKeyState() {
  return useAtomValue(encryptedSecretKeyState);
}

export function useSetLatestNonceCallback() {
  return useAtomCallback<void, number>(
    useCallback((get, set, newNonce) => {
      if (newNonce !== undefined) {
        const network = get(currentNetworkState);
        const address = get(currentAccountStxAddressState);
        if (!address) return;
        // we increment here for next nonce
        set(localNonceState([address, network.url]), newNonce + 1);
      }
    }, [])
  );
}

export function useFinishSignInCallback() {
  const { decodedAuthRequest, authRequest, appName, appIcon } = useOnboardingState();
  const keyActions = useKeyActions();
  const wallet = useWalletState();
  const { walletType } = useWalletType();
  const accounts = useAccounts();

  return useCallback(
    async (accountIndex: number) => {
      const account = accounts?.[accountIndex];

      const legacyAccount = wallet?.accounts[accountIndex];

      if (!decodedAuthRequest || !authRequest || !account || !legacyAccount || !wallet) {
        logger.error('Uh oh! Finished onboarding without auth info.');
        return;
      }

      const appURL = new URL(decodedAuthRequest.redirect_uri);

      // We can't perform any of this logic for non-software wallets
      // as they require the key to be available in the JS context
      if (walletType === 'software') {
        const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
        const walletConfig = await getOrCreateWalletConfig({
          wallet,
          gaiaHubConfig,
          skipUpload: true,
        });
        await updateWalletConfigWithApp({
          wallet,
          walletConfig,
          gaiaHubConfig,
          account: legacyAccount,
          app: {
            origin: appURL.origin,
            lastLoginAt: new Date().getTime(),
            scopes: decodedAuthRequest.scopes,
            appIcon: appIcon as string,
            name: appName as string,
          },
        });
        const authResponse = await makeAuthResponse({
          gaiaHubUrl: gaiaUrl,
          appDomain: appURL.origin,
          transitPublicKey: decodedAuthRequest.public_keys[0],
          scopes: decodedAuthRequest.scopes,
          account: legacyAccount,
        });

        keyActions.switchAccount(accountIndex);
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      }
    },
    [accounts, appIcon, appName, authRequest, decodedAuthRequest, keyActions, wallet, walletType]
  );
}

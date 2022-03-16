import { useCallback } from 'react';
import { useAtom } from 'jotai';
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
import { useDeriveAccountsFromWalletSalt } from '@app/common/hooks/account/use-account-from-wallet-salt';
import { appPrivateKeyFromAccount } from '@app/common/utils/wallet-salt-that-generated-incorrect-appkey';

export function useWalletState() {
  return useAtom(walletState);
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
  const accountsFromWalletSalt = useDeriveAccountsFromWalletSalt();
  return useAtomCallback<void, number>(
    useCallback(
      async (get, _set, accountIndex) => {
        const wallet = get(walletState);
        const account = wallet?.accounts[accountIndex];
        if (!decodedAuthRequest || !authRequest || !account || !wallet) {
          logger.error('Uh oh! Finished onboarding without auth info.');
          return;
        }
        const appURL = new URL(decodedAuthRequest.redirect_uri);
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
          account,
          app: {
            origin: appURL.origin,
            lastLoginAt: new Date().getTime(),
            scopes: decodedAuthRequest.scopes,
            appIcon: appIcon as string,
            name: appName as string,
          },
        });

        const appPrivateKeyFromWalletSalt = appPrivateKeyFromAccount({
          accountFromWalletSalt: accountsFromWalletSalt[accountIndex],
          appDomain: appURL.origin,
        });

        const authResponse = await makeAuthResponse({
          gaiaHubUrl: gaiaUrl,
          appDomain: appURL.origin,
          transitPublicKey: decodedAuthRequest.public_keys[0],
          scopes: decodedAuthRequest.scopes,
          account,
          appPrivateKeyFromWalletSalt,
        });
        keyActions.switchAccount(accountIndex);
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      },
      [decodedAuthRequest, authRequest, appIcon, appName, accountsFromWalletSalt, keyActions]
    )
  );
}

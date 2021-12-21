import { useAtomCallback, useAtomValue } from 'jotai/utils';
import type { InMemoryVault, VaultActions } from '@shared/vault/vault-types';
import { gaiaUrl } from '@shared/constants';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { textToBytes } from '@app/common/store-utils';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  makeAuthResponse,
  updateWalletConfigWithApp,
} from '@stacks/wallet-sdk';
import { currentAccountIndexState, currentAccountStxAddressState } from '@app/store/accounts';
import { localNonceState } from '@app/store/accounts/nonce';
import { currentNetworkState } from '@app/store/network/networks';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  encryptedSecretKeyState,
  hasRehydratedVaultStore,
  hasSetPasswordState,
  secretKeyState,
  walletState,
} from './wallet';
import { finalizeAuthResponse } from '@app/common/actions/finalize-auth-response';
import { logger } from '@shared/logger';

export function useHasRehydratedVault() {
  return useAtomValue(hasRehydratedVaultStore);
}

export function useWalletState() {
  return useAtom(walletState);
}

export function useSecretKey() {
  return useAtomValue(secretKeyState);
}

export function useEncryptedSecretKeyState() {
  return useAtomValue(encryptedSecretKeyState);
}

export function useHasSetPasswordState() {
  return useAtomValue(hasSetPasswordState);
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
  return useAtomCallback<void, number>(
    useCallback(
      async (get, set, accountIndex) => {
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
        const authResponse = await makeAuthResponse({
          gaiaHubUrl: gaiaUrl,
          appDomain: appURL.origin,
          transitPublicKey: decodedAuthRequest.public_keys[0],
          scopes: decodedAuthRequest.scopes,
          account,
        });
        set(currentAccountIndexState, accountIndex);
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      },
      [appName, appIcon, authRequest, decodedAuthRequest]
    )
  );
}

export function useInnerMessageWrapper() {
  return useAtomCallback<void, VaultActions>(
    useCallback(async (_get, set, message) => {
      return new Promise<InMemoryVault>((resolve, reject) => {
        chrome.runtime.sendMessage(message, (vaultOrError: InMemoryVault | Error) => {
          try {
            if ('hasSetPassword' in vaultOrError) {
              const vault = vaultOrError;
              set(hasRehydratedVaultStore, true);
              set(hasSetPasswordState, vault.hasSetPassword);
              set(walletState, vault.wallet);
              set(secretKeyState, vault.secretKey ? textToBytes(vault.secretKey) : undefined);
              typeof vault.currentAccountIndex !== 'undefined' &&
                set(currentAccountIndexState, vault.currentAccountIndex);
              set(encryptedSecretKeyState, vault.encryptedSecretKey);
              resolve(vault);
            } else {
              reject(vaultOrError);
            }
          } catch (e) {
            logger.error(e);
          }
        });
      });
    }, [])
  );
}

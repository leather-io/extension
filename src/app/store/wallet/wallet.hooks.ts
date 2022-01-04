import { useAtomCallback, useAtomValue } from 'jotai/utils';
import type { BackgroundActions, InMemorySoftwareWalletVault } from '@shared/vault/vault-types';
import { gaiaUrl } from '@shared/constants';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';

import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  makeAuthResponse,
  updateWalletConfigWithApp,
} from '@stacks/wallet-sdk';
import { currentAccountStxAddressState } from '@app/store/accounts';
import { localNonceState } from '@app/store/accounts/nonce';
import { currentNetworkState } from '@app/store/network/networks';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  encryptedSecretKeyState,
  hasSetPasswordState,
  secretKeyState,
  walletState,
} from './wallet';
import { finalizeAuthResponse } from '@app/common/actions/finalize-auth-response';
import { logger } from '@shared/logger';
import { useDispatch } from 'react-redux';
import { stxChainSlice } from '../chains/stx-chain.slice';

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
  const dispatch = useDispatch();
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
        const authResponse = await makeAuthResponse({
          gaiaHubUrl: gaiaUrl,
          appDomain: appURL.origin,
          transitPublicKey: decodedAuthRequest.public_keys[0],
          scopes: decodedAuthRequest.scopes,
          account,
        });
        dispatch(stxChainSlice.actions.switchAccount(accountIndex));
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      },
      [decodedAuthRequest, authRequest, appIcon, appName, dispatch]
    )
  );
}

export function sendBackgroundMessage(message: BackgroundActions) {
  return new Promise(resolve =>
    chrome.runtime.sendMessage(message, (vaultResponse: InMemorySoftwareWalletVault) => {
      resolve(vaultResponse);
    })
  );
}

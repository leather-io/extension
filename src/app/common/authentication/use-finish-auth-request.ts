import { useCallback } from 'react';

import { bytesToHex } from '@stacks/common';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  makeAuthResponse,
  updateWalletConfigWithApp,
} from '@stacks/wallet-sdk';

import { finalizeAuthResponse } from '@shared/actions/finalize-auth-response';
import { gaiaUrl } from '@shared/constants';
import { logger } from '@shared/logger';

import { useAuthRequestParams } from '@app/common/hooks/auth/use-auth-request-params';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  useAllBitcoinNativeSegWitNetworksByAccount,
  useCurrentBitcoinNativeSegwitAddressIndexKeychain,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  useAllBitcoinTaprootNetworksByAccount,
  useCurrentTaprootAddressIndexKeychain,
} from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksWallet } from '@app/store/accounts/blockchain/stacks/stacks-keychain';

export function useFinishAuthRequest() {
  const { decodedAuthRequest, authRequest, appName, appIcon } = useOnboardingState();
  const keyActions = useKeyActions();
  const wallet = useStacksWallet();
  const { walletType } = useWalletType();
  const accounts = useStacksAccounts();
  const { origin, tabId } = useAuthRequestParams();

  // TODO: It would be good to separate out finishing auth by the wallet vs an app
  // so that the additional data we provide apps can be removed from our onboarding.
  // Currently, these create errors unless early returns are used in the keychain code.
  const deriveNativeSegWitAccountAtIndex = useAllBitcoinNativeSegWitNetworksByAccount();
  const deriveTaprootAccountAtIndex = useAllBitcoinTaprootNetworksByAccount();
  const currentBitcoinNativeSegwitAddressIndexKeychain =
    useCurrentBitcoinNativeSegwitAddressIndexKeychain();
  const currentBitcoinTaprootAddressIndexKeychain = useCurrentTaprootAddressIndexKeychain();

  return useCallback(
    async (accountIndex: number) => {
      const account = accounts?.[accountIndex];

      const legacyAccount = wallet?.accounts[accountIndex];

      if (
        !decodedAuthRequest ||
        !authRequest ||
        !account ||
        !legacyAccount ||
        !wallet ||
        !origin ||
        !tabId
      ) {
        logger.error('Uh oh! Finished onboarding without auth info.');
        return;
      }

      const appURL = new URL(origin);

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
          additionalData: {
            btcAddress: {
              p2tr: deriveTaprootAccountAtIndex(accountIndex),
              p2wpkh: deriveNativeSegWitAccountAtIndex(accountIndex),
            },
            btcPublicKey: {
              p2tr: bytesToHex(currentBitcoinTaprootAddressIndexKeychain?.publicKey!),
              p2wpkh: bytesToHex(currentBitcoinNativeSegwitAddressIndexKeychain?.publicKey!),
            },
          },
        });
        keyActions.switchAccount(accountIndex);
        finalizeAuthResponse({
          decodedAuthRequest,
          authRequest,
          authResponse,
          requestingOrigin: origin,
          tabId,
        });
      }
    },
    [
      accounts,
      wallet,
      decodedAuthRequest,
      authRequest,
      origin,
      tabId,
      walletType,
      appIcon,
      appName,
      deriveTaprootAccountAtIndex,
      deriveNativeSegWitAccountAtIndex,
      currentBitcoinTaprootAddressIndexKeychain?.publicKey,
      currentBitcoinNativeSegwitAddressIndexKeychain?.publicKey,
      keyActions,
    ]
  );
}

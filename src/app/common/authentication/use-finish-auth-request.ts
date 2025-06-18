import { useCallback } from 'react';

import { makeAuthResponse } from '@stacks/wallet-sdk';

import { gaiaUrl } from '@leather.io/constants';

import { finalizeAuthResponse } from '@shared/actions/finalize-auth-response';
import { logger } from '@shared/logger';

import { useAuthRequestParams } from '@app/common/hooks/auth/use-auth-request-params';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  useLegacyStacksWallet,
  useStacksAccounts,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useGetLegacyAuthBitcoinAddresses } from './use-legacy-auth-bitcoin-addresses';

export function useFinishAuthRequest() {
  const { decodedAuthRequest, authRequest } = useOnboardingState();
  const keyActions = useKeyActions();
  const stacksAccounts = useStacksAccounts();
  const { walletType } = useWalletType();

  const { origin, tabId } = useAuthRequestParams();

  const wallet = useLegacyStacksWallet();

  // TODO: It would be good to separate out finishing auth by the wallet vs an app
  // so that the additional data we provide apps can be removed from our onboarding.
  // Currently, these create errors unless early returns are used in the keychain code.
  const getLegacyAuthBitcoinData = useGetLegacyAuthBitcoinAddresses();

  return useCallback(
    async (accountIndex: number) => {
      const account = stacksAccounts?.[accountIndex];

      if (!decodedAuthRequest || !authRequest || !account || !stacksAccounts || !origin || !tabId) {
        logger.error('Uh oh! Finished onboarding without auth info.');
        return;
      }

      const appURL = new URL(origin);

      // We can't perform any of this logic for non-software wallets
      // as they require the key to be available in the JS context
      if (walletType === 'software' && account.type === 'software') {
        if (!wallet) return;

        try {
          const authResponse = await makeAuthResponse({
            gaiaHubUrl: gaiaUrl,
            appDomain: appURL.origin,
            transitPublicKey: decodedAuthRequest.public_keys[0],
            scopes: decodedAuthRequest.scopes,
            account: account,
            additionalData: {
              ...getLegacyAuthBitcoinData(accountIndex),
              walletProvider: 'leather',
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
        } catch (e) {
          logger.error('Error finishing auth request', e);
        }
      }
    },
    [
      decodedAuthRequest,
      authRequest,
      stacksAccounts,
      origin,
      tabId,
      walletType,
      wallet,
      getLegacyAuthBitcoinData,
      keyActions,
    ]
  );
}

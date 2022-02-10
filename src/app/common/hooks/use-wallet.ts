import { useCallback } from 'react';

import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { useOnboardingState } from './auth/use-onboarding-state';

import { bytesToText } from '@app/common/store-utils';
import {
  useEncryptedSecretKeyState,
  useFinishSignInCallback,
  useSecretKey,
  useSetLatestNonceCallback,
  useWalletState,
} from '@app/store/wallet/wallet.hooks';
import {
  useCurrentAccount,
  useCurrentAccountIndex,
  useCurrentAccountStxAddressState,
  useTransactionNetworkVersion,
} from '@app/store/accounts/account.hooks';
import {
  useCurrentNetworkKey,
  useCurrentNetworkState,
  useNetworkState,
} from '@app/store/network/networks.hooks';
import { finalizeAuthResponse } from '@app/common/actions/finalize-auth-response';
import { getAccountDisplayName } from '../utils/get-account-display-name';

export function useWallet() {
  const [wallet, setWallet] = useWalletState();
  const secretKey = useSecretKey();
  const encryptedSecretKey = useEncryptedSecretKeyState();
  const currentAccountIndex = useCurrentAccountIndex();
  const currentAccount = useCurrentAccount();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const transactionVersion = useTransactionNetworkVersion();
  const networks = useNetworkState();
  const currentNetwork = useCurrentNetworkState();
  const currentNetworkKey = useCurrentNetworkKey();
  const keyActions = useKeyActions();

  const currentAccountDisplayName = currentAccount
    ? getAccountDisplayName(currentAccount)
    : undefined;

  const { decodedAuthRequest, authRequest } = useOnboardingState();

  const hasGeneratedWallet = !!wallet;

  const setLatestNonce = useSetLatestNonceCallback();

  const cancelAuthentication = useCallback(() => {
    if (!decodedAuthRequest || !authRequest) {
      return;
    }
    const authResponse = 'cancel';
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  }, [decodedAuthRequest, authRequest]);

  const finishSignIn = useFinishSignInCallback();

  return {
    wallet,
    secretKey: secretKey ? bytesToText(secretKey) : undefined,
    hasGeneratedWallet,
    currentAccount,
    currentAccountIndex,
    currentAccountStxAddress,
    currentAccountDisplayName,
    transactionVersion,
    networks,
    currentNetwork,
    currentNetworkKey,
    encryptedSecretKey,
    finishSignIn,
    setLatestNonce,
    setWallet,
    cancelAuthentication,
    ...keyActions,
  };
}

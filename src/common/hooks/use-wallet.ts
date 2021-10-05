import { useCallback } from 'react';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

import { useOnboardingState } from './auth/use-onboarding-state';

import { bytesToText } from '@common/store-utils';
import {
  useEncryptedSecretKeyStore,
  useFinishSignInCallback,
  useHasRehydratedVault,
  useHasSetPasswordState,
  useSecretKey,
  useSetLatestNonceCallback,
  useWalletState,
} from '@store/wallet/wallet.hooks';
import {
  useCurrentAccount,
  useCurrentAccountIndex,
  useCurrentAccountStxAddressState,
  useTransactionNetworkVersion,
} from '@store/accounts/account.hooks';
import {
  useCurrentNetworkKey,
  useCurrentNetworkState,
  useNetworkState,
} from '@store/network/networks.hooks';
import { finalizeAuthResponse } from '@common/actions/finalize-auth-response';

export function useWallet() {
  const hasRehydratedVault = useHasRehydratedVault();
  const [wallet, setWallet] = useWalletState();
  const secretKey = useSecretKey();
  const encryptedSecretKey = useEncryptedSecretKeyStore();
  const currentAccountIndex = useCurrentAccountIndex();
  const hasSetPassword = useHasSetPasswordState();
  const currentAccount = useCurrentAccount();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const transactionVersion = useTransactionNetworkVersion();
  const networks = useNetworkState();
  const currentNetwork = useCurrentNetworkState();
  const currentNetworkKey = useCurrentNetworkKey();
  const vaultMessenger = useVaultMessenger();

  const currentAccountDisplayName = currentAccount
    ? getAccountDisplayName(currentAccount)
    : undefined;

  const { decodedAuthRequest, authRequest } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doSetLatestNonce = useSetLatestNonceCallback();

  const handleCancelAuthentication = useCallback(() => {
    if (!decodedAuthRequest || !authRequest) {
      return;
    }
    const authResponse = 'cancel';
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  }, [decodedAuthRequest, authRequest]);

  const doFinishSignIn = useFinishSignInCallback();

  return {
    hasRehydratedVault,
    wallet,
    secretKey: secretKey ? bytesToText(secretKey) : undefined,
    isSignedIn,
    currentAccount,
    currentAccountIndex,
    currentAccountStxAddress,
    currentAccountDisplayName,
    transactionVersion,

    networks,
    currentNetwork,
    currentNetworkKey,
    encryptedSecretKey,
    hasSetPassword,
    doFinishSignIn,
    doSetLatestNonce,
    setWallet,
    handleCancelAuthentication,
    ...vaultMessenger,
  };
}

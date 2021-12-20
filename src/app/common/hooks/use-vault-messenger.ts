import { useCallback } from 'react';

import { SetPassword, StoreSeed, UnlockWallet, SwitchAccount } from '@shared/vault/vault-types';
import { InternalMethods } from '@shared/message-types';

import { useInnerMessageWrapper } from '@app/store/wallet/wallet.hooks';
import { clearSessionLocalData } from '@app/common/store-utils';
import { useAnalytics } from './analytics/use-analytics';

export function useVaultMessenger() {
  const innerMessageWrapper = useInnerMessageWrapper();
  const analytics = useAnalytics();

  const setPassword = useCallback(
    (payload: string) => {
      const message: SetPassword = {
        method: InternalMethods.setPassword,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const storeSeed = useCallback(
    (payload: { secretKey: string; password?: string }) => {
      const message: StoreSeed = {
        method: InternalMethods.storeSeed,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const unlockWallet = useCallback(
    payload => {
      const message: UnlockWallet = {
        method: InternalMethods.unlockWallet,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const switchAccount = useCallback(
    payload => {
      const message: SwitchAccount = {
        method: InternalMethods.switchAccount,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const getWallet = () =>
    innerMessageWrapper({ method: InternalMethods.getWallet, payload: undefined });
  const makeWallet = () =>
    innerMessageWrapper({ method: InternalMethods.makeWallet, payload: undefined });
  const createNewAccount = () =>
    innerMessageWrapper({
      method: InternalMethods.createNewAccount,
      payload: undefined,
    });
  const handleSignOut = () =>
    innerMessageWrapper({ method: InternalMethods.signOut, payload: undefined });
  const signOut = async () => {
    await handleSignOut();
    void analytics.track('sign_out');
    clearSessionLocalData();
  };
  const lockWallet = () =>
    innerMessageWrapper({ method: InternalMethods.lockWallet, payload: undefined });

  return {
    getWallet,
    makeWallet,
    createNewAccount,
    signOut,
    lockWallet,
    setPassword,
    storeSeed,
    unlockWallet,
    switchAccount,
  };
}

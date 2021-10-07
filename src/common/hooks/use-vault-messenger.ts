import { useCallback } from 'react';

import { SetPassword, StoreSeed, UnlockWallet, SwitchAccount } from '@background/vault-types';
import { InternalMethods } from '@common/message-types';
import { useInnerMessageWrapper } from '@store/wallet/wallet.hooks';
import { clearSessionLocalData } from '@common/store-utils';
import { useAnalytics } from './analytics/use-analytics';

export function useVaultMessenger() {
  const innerMessageWrapper = useInnerMessageWrapper();
  const analytics = useAnalytics();

  const doSetPassword = useCallback(
    (payload: string) => {
      const message: SetPassword = {
        method: InternalMethods.setPassword,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doStoreSeed = useCallback(
    (payload: { secretKey: string; password?: string }) => {
      const message: StoreSeed = {
        method: InternalMethods.storeSeed,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doUnlockWallet = useCallback(
    payload => {
      const message: UnlockWallet = {
        method: InternalMethods.unlockWallet,
        payload,
      };
      return innerMessageWrapper(message);
    },
    [innerMessageWrapper]
  );

  const doSwitchAccount = useCallback(
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
  const doMakeWallet = () =>
    innerMessageWrapper({ method: InternalMethods.makeWallet, payload: undefined });
  const doCreateNewAccount = () =>
    innerMessageWrapper({
      method: InternalMethods.createNewAccount,
      payload: undefined,
    });
  const handleSignOut = () =>
    innerMessageWrapper({ method: InternalMethods.signOut, payload: undefined });
  const doSignOut = async () => {
    await handleSignOut();
    void analytics.track('sign_out');
    clearSessionLocalData();
  };
  const doLockWallet = () =>
    innerMessageWrapper({ method: InternalMethods.lockWallet, payload: undefined });

  return {
    getWallet,
    doMakeWallet,
    doCreateNewAccount,
    doSignOut,
    doLockWallet,
    doSetPassword,
    doStoreSeed,
    doUnlockWallet,
    doSwitchAccount,
  };
}

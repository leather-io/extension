import { useCallback } from 'react';

import {
  useAccounts,
  useCurrentAccount,
  useHasSwitchedAccounts,
  useTransactionAccountIndex,
  useTransactionNetworkVersion,
} from '@app/store/accounts/account.hooks';

import { useTrackSwitchAccount } from '../analytics/use-track-switch-account';
import { useKeyActions } from '../use-key-actions';

const TIMEOUT = 350;

export function useSwitchAccount(callback?: () => void) {
  const { switchAccount } = useKeyActions();
  const currentAccount = useCurrentAccount();
  const accounts = useAccounts();
  const txIndex = useTransactionAccountIndex();
  const transactionVersion = useTransactionNetworkVersion();
  const [hasSwitched, setHasSwitched] = useHasSwitchedAccounts();
  const trackSwitchAccount = useTrackSwitchAccount();

  const handleSwitchAccount = useCallback(
    async (index: number) => {
      setHasSwitched(true);
      switchAccount(index);
      if (callback) setTimeout(() => callback(), TIMEOUT);
      if (!accounts) return;
      void trackSwitchAccount(accounts[index].address, index);
    },
    [setHasSwitched, switchAccount, callback, accounts, trackSwitchAccount]
  );

  const getIsActive = useCallback(
    (index: number) =>
      typeof txIndex === 'number' && !hasSwitched
        ? index === txIndex
        : index === currentAccount?.index,
    [txIndex, hasSwitched, currentAccount]
  );

  return { handleSwitchAccount, getIsActive, transactionVersion };
}

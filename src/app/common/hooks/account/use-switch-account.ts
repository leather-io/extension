import { useCallback } from 'react';

import { useWallet } from '@app/common/hooks/use-wallet';
import {
  useCurrentAccount,
  useHasSwitchedAccounts,
  useTransactionAccountIndex,
  useTransactionNetworkVersion,
} from '@app/store/accounts/account.hooks';

const TIMEOUT = 350;

export const useSwitchAccount = (callback?: () => void) => {
  const { switchAccount } = useWallet();
  const currentAccount = useCurrentAccount();
  const txIndex = useTransactionAccountIndex();
  const transactionVersion = useTransactionNetworkVersion();
  const [hasSwitched, setHasSwitched] = useHasSwitchedAccounts();

  const handleSwitchAccount = useCallback(
    async index => {
      if (typeof txIndex === 'number') setHasSwitched(true);
      await switchAccount(index);
      if (callback) {
        window.setTimeout(() => {
          callback();
        }, TIMEOUT);
      }
    },
    [txIndex, setHasSwitched, switchAccount, callback]
  );

  const getIsActive = useCallback(
    (index: number) =>
      typeof txIndex === 'number' && !hasSwitched
        ? index === txIndex
        : index === currentAccount?.index,
    [txIndex, hasSwitched, currentAccount]
  );

  return { handleSwitchAccount, getIsActive, transactionVersion };
};

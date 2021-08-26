import { allAccountsNameState, currentAccountNameState } from '@store/accounts/names';
import { Account } from '@stacks/wallet-sdk';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { cleanUsername } from '@common/utils';
import { useAtomValue } from 'jotai/utils';

export function useAccountNames() {
  return useAtomValue(allAccountsNameState);
}

export function useCurrentAccountNames() {
  return useAtomValue(currentAccountNameState);
}

export function useCurrentAccountDisplayName() {
  const names = useCurrentAccountNames();
  const account = useCurrentAccount();
  if (!account || typeof account?.index !== 'number') return 'Account';
  return (
    names?.[0] ||
    (account?.username && cleanUsername(account.username)) ||
    `Account ${account?.index + 1}`
  );
}

export function useAccountDisplayName(providedAccount?: Account) {
  // if we don't pass an account, we should use this
  // as it will only fetch the single name if we need it
  if (!providedAccount) return useCurrentAccountDisplayName();
  const account = providedAccount;
  const names = useAccountNames();
  if (!account || typeof account?.index !== 'number') return 'Account';
  return (
    names?.[account.index]?.names?.[0] ||
    (account?.username && cleanUsername(account.username)) ||
    `Account ${account?.index + 1}`
  );
}

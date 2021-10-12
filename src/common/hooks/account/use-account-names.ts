import { Account } from '@stacks/wallet-sdk';
import { cleanUsername } from '@common/utils';
import {
  useAccountNames,
  useCurrentAccount,
  useCurrentAccountNames,
} from '@store/accounts/account.hooks';

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
  const accountDisplayName = useCurrentAccountDisplayName();
  const names = useAccountNames();
  const account = providedAccount;

  if (!providedAccount) return accountDisplayName;
  if (!account || typeof account?.index !== 'number') return 'Account';
  return (
    names?.[account.index]?.names?.[0] ||
    (account?.username && cleanUsername(account.username)) ||
    `Account ${account?.index + 1}`
  );
}

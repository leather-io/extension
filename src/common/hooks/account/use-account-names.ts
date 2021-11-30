import { Account } from '@stacks/wallet-sdk';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { useAllAccountNames, useCurrentAccountNames } from '@query/bns/bns.hooks';

export function useCurrentAccountDisplayName() {
  const names = useCurrentAccountNames();
  const account = useCurrentAccount();
  if (!account || typeof account?.index !== 'number') return 'Account';
  return names?.[0] || `Account ${account?.index + 1}`;
}

export function useAccountDisplayName(providedAccount?: Account) {
  // if we don't pass an account, we should use this
  // as it will only fetch the single name if we need it
  const accountDisplayName = useCurrentAccountDisplayName();
  const names = useAllAccountNames();
  const account = providedAccount;

  if (!providedAccount) return accountDisplayName;
  if (!account || typeof account?.index !== 'number') return 'Account';
  return names?.[account.index]?.names?.[0] || `Account ${account?.index + 1}`;
}

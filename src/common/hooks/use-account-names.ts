import { accountNameState } from '@store/names';
import { useLoadable } from '@common/hooks/use-loadable';
import { useCurrentAccount } from '@common/hooks/use-current-account';
import { Account } from '@stacks/wallet-sdk';

export function useAccountNames() {
  return useLoadable(accountNameState);
}

export function useAccountDisplayName(__account?: Account) {
  const names = useAccountNames();
  const _account = useCurrentAccount();
  const account = __account || _account;
  if (!account || typeof account?.index !== 'number') return 'Account';
  return names.value?.[account.index]?.names?.[0] || `Account ${account?.index + 1}`;
}

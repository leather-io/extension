import { useMemo } from 'react';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useCurrentAccountNames, useGetAccountNamesByAddressQuery } from '@app/query/bns/bns.hooks';

export function useCurrentAccountDisplayName() {
  const names = useCurrentAccountNames();
  const account = useCurrentAccount();
  return useMemo(() => {
    if (!account || typeof account?.index !== 'number') return 'Account';
    return names?.[0] || `Account ${account?.index + 1}`;
  }, [account, names]);
}

export function useAccountDisplayName(address: string, index: number) {
  const names = useGetAccountNamesByAddressQuery(address);

  return useMemo(() => {
    if (!names.length) return `Account ${index + 1}`;
    return names[0];
  }, [index, names]);
}

import { useMemo } from 'react';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useCurrentAccountNames, useGetAccountNamesByAddressQuery } from '@app/query/bns/bns.hooks';
import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';
import { AccountWithAddress } from '@app/store/accounts/account.models';

export function useCurrentAccountDisplayName() {
  const names = useCurrentAccountNames();
  const account = useCurrentAccount();
  return useMemo(() => {
    if (!account || typeof account?.index !== 'number') return 'Account';
    return names?.[0] || `Account ${account?.index + 1}`;
  }, [account, names]);
}

export function useAccountDisplayName(account: AccountWithAddress) {
  const names = useGetAccountNamesByAddressQuery(account.address);
  return useMemo(() => names[0] ?? getAccountDisplayName(account), [account, names]);
}

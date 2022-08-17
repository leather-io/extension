import { useMemo } from 'react';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import {
  useCurrentAccountNames,
  useGetAccountNamesByAddressQuery,
} from '@app/query/stacks/bns/bns.hooks';
import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';
import { AccountWithAddress } from '@app/store/accounts/account.models';

export function useCurrentAccountDisplayName() {
  const account = useCurrentAccount();
  const names = useCurrentAccountNames();

  return useMemo(() => {
    if (!account || typeof account?.index !== 'number') return 'Account';
    return names?.[0] || `Account ${account?.index + 1}`;
  }, [account, names]);
}

export function useAccountDisplayName(account: AccountWithAddress): string {
  const names = useGetAccountNamesByAddressQuery(account.address);
  return useMemo(() => names[0] ?? getAccountDisplayName(account), [account, names]);
}

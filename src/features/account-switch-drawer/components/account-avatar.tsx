import React, { memo } from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { AccountWithAddress } from '@store/accounts/account.models';
import { AccountAvatar } from '@components/account-avatar/account-avatar';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { useGetAccountNamesByAddressQuery } from '@query/bns/bns.hooks';

interface AccountAvatarProps extends BoxProps {
  account: AccountWithAddress;
}
const AccountAvatarSuspense = memo(({ account }: AccountAvatarProps) => {
  const name = useGetAccountNamesByAddressQuery(account.address);
  return <AccountAvatar name={name[0] ?? getAccountDisplayName(account)} account={account} />;
});

export const AccountAvatarItem = memo(({ account, ...rest }: AccountAvatarProps) => {
  const defaultName = getAccountDisplayName(account);
  return (
    <Box {...rest}>
      <React.Suspense fallback={<AccountAvatar name={defaultName} account={account} />}>
        <AccountAvatarSuspense account={account} />
      </React.Suspense>
    </Box>
  );
});

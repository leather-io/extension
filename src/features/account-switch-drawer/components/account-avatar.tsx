import React, { memo } from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { useAccountDisplayName } from '@common/hooks/account/use-account-names';
import { AccountWithAddress } from '@store/accounts/account.models';
import { AccountAvatar } from '@components/account-avatar/account-avatar';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

interface AccountAvatarProps extends BoxProps {
  account: AccountWithAddress;
}
const AccountAvatarSuspense = memo(({ account }: AccountAvatarProps) => {
  const name = useAccountDisplayName(account);
  return <AccountAvatar name={name} account={account} />;
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

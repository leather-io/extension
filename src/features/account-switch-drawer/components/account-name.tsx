import React, { memo } from 'react';
import { AccountWithAddress } from '@store/accounts/account.models';
import { Box, BoxProps } from '@stacks/ui';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

import { Title } from '@components/typography';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';

interface AccountNameProps extends BoxProps {
  account: AccountWithAddress;
}
const AccountNameSuspense = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);

  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" fontFamily="'Inter'">
      {name}
    </Title>
  );
});

export const AccountName = memo(({ account, ...rest }: AccountNameProps) => {
  const defaultName = getAccountDisplayName(account);
  return (
    <Box {...rest}>
      <React.Suspense
        fallback={
          <Title fontSize={2} lineHeight="1rem" fontWeight="400">
            {defaultName}
          </Title>
        }
      >
        <AccountNameSuspense account={account} />
      </React.Suspense>
    </Box>
  );
});

import { memo } from 'react';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { BoxProps } from '@stacks/ui';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

import { Title } from '@app/components/typography';
import { useGetAccountNamesByAddressQuery } from '@app/query/bns/bns.hooks';

interface AccountNameProps extends BoxProps {
  account: AccountWithAddress;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useGetAccountNamesByAddressQuery(account.address);

  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400">
      {name[0] ?? getAccountDisplayName(account)}
    </Title>
  );
});

interface AccountNameFallbackProps {
  account: AccountWithAddress;
}
export const AccountNameFallback = memo(({ account }: AccountNameFallbackProps) => {
  const defaultName = getAccountDisplayName(account);

  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400">
      {defaultName}
    </Title>
  );
});

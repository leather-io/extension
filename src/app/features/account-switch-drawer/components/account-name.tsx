import { memo } from 'react';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { BoxProps } from '@stacks/ui';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

import { Title } from '@app/components/typography';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';

interface AccountNameProps extends BoxProps {
  account: AccountWithAddress;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);

  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400">
      {name}
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

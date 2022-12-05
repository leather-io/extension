import { memo } from 'react';

import { BoxProps } from '@stacks/ui';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { Title } from '@app/components/typography';
import { AccountWithAddress } from '@app/store/accounts/account.models';

const AccountNameLayout = memo(({ children }) => (
  <Title fontSize={2} lineHeight="1rem" fontWeight="400">
    {children}
  </Title>
));

interface AccountNameProps extends BoxProps {
  account: AccountWithAddress;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);
  return <AccountNameLayout>{name}</AccountNameLayout>;
});

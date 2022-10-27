import { memo } from 'react';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';

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

import { memo } from 'react';

import { BoxProps } from '@stacks/ui';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { Title } from '@app/components/typography';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

const AccountNameLayout = memo(({ children }) => (
  <Title fontSize={2} lineHeight="1rem" fontWeight="400">
    {children}
  </Title>
));

interface AccountNameProps extends BoxProps {
  account: StacksAccount;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);
  return <AccountNameLayout>{name}</AccountNameLayout>;
});

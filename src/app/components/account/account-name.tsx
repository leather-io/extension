import { memo } from 'react';

import { BoxProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface AccountNameLayoutProps {
  children: React.ReactNode;
}
const AccountNameLayout = memo(({ children }: AccountNameLayoutProps) => (
  <styled.p textStyle="label.01">{children}</styled.p>
));

interface AccountNameProps extends BoxProps {
  account: StacksAccount;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);
  return <AccountNameLayout>{name}</AccountNameLayout>;
});

import { memo } from 'react';

import { BoxProps } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { BtcAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin-accounts.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface AccountNameLayoutProps {
  children: React.ReactNode;
}
export const AccountNameLayout = memo(({ children }: AccountNameLayoutProps) => (
  <styled.p textStyle="label.01">{children}</styled.p>
));

interface AccountNameProps extends BoxProps {
  account: StacksAccount | BtcAccount;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);
  return <AccountNameLayout>{name}</AccountNameLayout>;
});

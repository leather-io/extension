import { BoxProps, color, Circle } from '@stacks/ui';
import React from 'react';
import { Account, getAccountDisplayName } from '@stacks/wallet-sdk';

import { useAccountGradient } from '@common/hooks/account/use-account-gradient';
import { AccountWithAddress } from '@store/accounts/account.models';

interface AccountAvatarProps extends BoxProps {
  account: AccountWithAddress | Account;
  name?: string;
}
export const AccountAvatar = ({ account, name, ...props }: AccountAvatarProps) => {
  const displayName = name && name.includes('.') ? name : getAccountDisplayName(account);
  const gradient = useAccountGradient(account);

  const circleText = displayName?.includes('Account') ? displayName.split(' ')[1] : displayName[0];
  return (
    <Circle flexShrink={0} backgroundImage={gradient} color={color('bg')} {...props}>
      {circleText.toUpperCase()}
    </Circle>
  );
};

interface AccountAvatarWithNameInnerProps extends BoxProps {
  name: string;
  account: AccountWithAddress | Account;
}
const AccountAvatarWithNameInner = (props: AccountAvatarWithNameInnerProps) => {
  const { account, name, ...rest } = props;
  return <AccountAvatar account={account} name={name} {...rest} />;
};

interface AccountAvatarWithNameProps extends BoxProps {
  name: string;
  account: AccountWithAddress | Account;
}
export const AccountAvatarWithName = ({ account, name, ...props }: AccountAvatarWithNameProps) => {
  return (
    <React.Suspense fallback={<AccountAvatar account={account} {...props} />}>
      <AccountAvatarWithNameInner account={account} name={name} {...props} />
    </React.Suspense>
  );
};

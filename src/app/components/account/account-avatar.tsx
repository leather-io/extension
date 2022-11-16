import { memo } from 'react';

import { BoxProps } from '@stacks/ui';

import { AccountAvatar } from '@app/components/account/account-avatar/account-avatar';

interface AccountAvatarItemProps extends BoxProps {
  publicKey: string;
  index: number;
  name: string;
}
export const AccountAvatarItem = memo(({ name, publicKey, index }: AccountAvatarItemProps) => {
  return <AccountAvatar name={name} publicKey={publicKey} index={index} />;
});

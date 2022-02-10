import { memo, Suspense } from 'react';
import { BoxProps, color, Circle } from '@stacks/ui';

import { useAccountGradient } from '@app/common/hooks/account/use-account-gradient';

interface AccountAvatarProps extends BoxProps {
  publicKey: string;
  name: string;
}
export const AccountAvatar = memo(({ publicKey, name, ...props }: AccountAvatarProps) => {
  const gradient = useAccountGradient(publicKey ?? '');

  const circleText = name?.includes('Account') ? name.split(' ')[1] : name[0];
  return (
    <Circle flexShrink={0} backgroundImage={gradient} color={color('bg')} {...props}>
      {circleText.toUpperCase()}
    </Circle>
  );
});

interface AccountAvatarWithNameInnerProps extends BoxProps {
  name: string;
  publicKey: string;
}
const AccountAvatarWithNameInner = (props: AccountAvatarWithNameInnerProps) => {
  const { publicKey, name, ...rest } = props;
  return <AccountAvatar publicKey={publicKey} name={name} {...rest} />;
};

interface AccountAvatarWithNameProps extends BoxProps {
  name: string;
  publicKey: string;
}
export const AccountAvatarWithName = (props: AccountAvatarWithNameProps) => {
  const { name, publicKey, ...rest } = props;
  return (
    <Suspense fallback={<AccountAvatar publicKey={publicKey} name={name} {...rest} />}>
      <AccountAvatarWithNameInner publicKey={publicKey} name={name} {...rest} />
    </Suspense>
  );
};

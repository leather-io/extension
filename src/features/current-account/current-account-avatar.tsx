import { memo, Suspense } from 'react';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { useCurrentAccountDisplayName } from '@common/hooks/account/use-account-names';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { AccountAvatar } from '@components/account-avatar/account-avatar';
import { BoxProps } from '@stacks/ui';

const AccountAvatarSuspense = memo((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  const name = useCurrentAccountDisplayName();
  if (!currentAccount) return null;
  return <AccountAvatar name={name} flexShrink={0} account={currentAccount} {...props} />;
});

export const CurrentAccountAvatar = memo((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;
  const defaultName = getAccountDisplayName(currentAccount);
  return (
    <Suspense
      fallback={
        <AccountAvatar name={defaultName} flexShrink={0} account={currentAccount} {...props} />
      }
    >
      <AccountAvatarSuspense {...props} />
    </Suspense>
  );
});

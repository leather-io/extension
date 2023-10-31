import { memo } from 'react';

import { CircleProps } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { AccountAvatar } from '@app/components/account/account-avatar/account-avatar';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export const CurrentAccountAvatar = memo((props: CircleProps) => {
  const currentAccount = useCurrentStacksAccount();
  const name = useCurrentAccountDisplayName();
  const { setIsShowingSwitchAccountsState } = useDrawers();
  if (!currentAccount) return null;
  return (
    <AccountAvatar
      index={currentAccount.index}
      name={name}
      onClick={() => setIsShowingSwitchAccountsState(true)}
      publicKey={currentAccount.stxPublicKey}
      {...props}
    />
  );
});

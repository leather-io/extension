import { memo } from 'react';

import { CircleProps } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { AccountAvatar } from '@app/components/account/account-avatar';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

export const CurrentAccountAvatar = memo((props: CircleProps) => {
  const accountIndex = useCurrentAccountIndex();
  const accounts = useStacksAccounts();
  const currentAccount = accounts[accountIndex] as StacksAccount | undefined;
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

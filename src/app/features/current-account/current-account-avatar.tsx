import { memo } from 'react';

import { CircleProps } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { AccountAvatar } from '@app/ui/components/account/account-avatar/account-avatar';

interface CurrentAccountAvatar extends CircleProps {
  toggleSwitchAccount(): void;
}
export const CurrentAccountAvatar = memo(({ toggleSwitchAccount }: CurrentAccountAvatar) => {
  const accountIndex = useCurrentAccountIndex();
  const accounts = useStacksAccounts();
  const currentAccount = accounts[accountIndex] as StacksAccount | undefined;
  const name = useCurrentAccountDisplayName();

  if (!currentAccount) return null;
  return (
    <AccountAvatar
      index={currentAccount.index}
      name={name}
      onClick={() => toggleSwitchAccount()}
      publicKey={currentAccount.stxPublicKey}
    />
  );
});

import { memo } from 'react';

import { AccountAvatar } from '@leather-wallet/ui';
import { CircleProps } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface CurrentAccountAvatar extends CircleProps {
  toggleSwitchAccount(): void;
}
export const CurrentAccountAvatar = memo(({ toggleSwitchAccount }: CurrentAccountAvatar) => {
  const stacksAccount = useCurrentStacksAccount();
  const name = useCurrentAccountDisplayName();
  if (!stacksAccount) return null;

  return (
    <AccountAvatar
      index={stacksAccount.index}
      name={name}
      onClick={() => toggleSwitchAccount()}
      publicKey={stacksAccount.stxPublicKey}
    />
  );
});

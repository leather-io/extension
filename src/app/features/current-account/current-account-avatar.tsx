import { memo } from 'react';

import { CircleProps } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { AccountAvatar } from '@app/components/account/account-avatar';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

export const CurrentAccountAvatar = memo(
  (props: CircleProps & { stacksAccount: StacksAccount | undefined }) => {
    const { stacksAccount } = props;
    const name = useCurrentAccountDisplayName();
    const { setIsShowingSwitchAccountsState } = useDrawers();
    if (!stacksAccount) return null;
    return (
      <AccountAvatar
        index={stacksAccount.index}
        name={name}
        onClick={() => setIsShowingSwitchAccountsState(true)}
        publicKey={stacksAccount.stxPublicKey}
        {...props}
      />
    );
  }
);

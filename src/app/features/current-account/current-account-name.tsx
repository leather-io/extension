import { Suspense, memo } from 'react';

import { BoxProps } from '@stacks/ui';
import { memoWithAs } from '@stacks/ui-core';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { truncateString } from '@app/common/utils';
import { Tooltip } from '@app/components/tooltip';
import { Title } from '@app/components/typography';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

function AccountNameTitle(props: BoxProps) {
  return (
    <Title
      as="h1"
      data-testid={SettingsSelectors.CurrentAccountDisplayName}
      fontSize={4}
      fontWeight={500}
      {...props}
    />
  );
}

const AccountNameSuspense = memo((props: BoxProps) => {
  const currentAccount = useCurrentStacksAccount();
  const name = useCurrentAccountDisplayName();
  if (!currentAccount || typeof currentAccount.index === 'undefined') return null;
  // FIXME: The name is truncated here with JS but we could just use CSS to do this
  const nameCharLimit = 18;
  const isLong = name.length > nameCharLimit;
  const displayName = truncateString(name, nameCharLimit);
  return (
    <AccountNameTitle {...props}>
      <Tooltip label={isLong ? name : undefined}>
        <div>{displayName}</div>
      </Tooltip>
    </AccountNameTitle>
  );
});

export const CurrentAccountName = memoWithAs((props: BoxProps) => {
  const defaultName = useCurrentAccountDisplayName();
  const fallback = <AccountNameTitle {...props}>{defaultName}</AccountNameTitle>;
  return (
    <Suspense fallback={fallback}>
      <AccountNameSuspense {...props} />
    </Suspense>
  );
});

import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { AccountBalanceLabel } from '@app/components/account/account-balance-label';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export const CurrentAccount = memo((props: StackProps) => {
  const currentAccount = useCurrentStacksAccount();
  if (!currentAccount) return null;
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentAccountName />
        <Stack isInline>
          <AccountBalanceLabel address={currentAccount.address} />
        </Stack>
      </Stack>
    </Stack>
  );
});

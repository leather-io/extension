import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountAddresses } from './account-addresses';

export const CurrentAccount = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentAccountName />
        <Stack isInline>
          <AccountAddresses />
        </Stack>
      </Stack>
    </Stack>
  );
});

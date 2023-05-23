import { memo } from 'react';

import { Stack, StackProps } from '@stacks/ui';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountTotalBalance } from '../../../components/account-total-balance';

export const CurrentAccount = memo((props: StackProps) => {
  const currentAccount = useCurrentStacksAccount();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  if (!currentAccount) return null;
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentAccountName />
        <Stack isInline>
          <AccountTotalBalance stxAddress={currentAccount.address} btcAddress={btcAddress} />
        </Stack>
      </Stack>
    </Stack>
  );
});

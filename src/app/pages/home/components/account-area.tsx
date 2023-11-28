import { memo } from 'react';

import { HStack, HstackProps, Stack } from 'leather-styles/jsx';

import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountTotalBalance } from '../../../components/account-total-balance';

export const CurrentAccount = memo((props: HstackProps) => {
  const currentAccount = useCurrentStacksAccount();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  if (!currentAccount) return null;
  return (
    <HStack gap="space.03" alignItems="center" {...props}>
      <CurrentAccountAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" gap="space.03">
        <CurrentAccountName />
        <HStack>
          <AccountTotalBalance stxAddress={currentAccount.address} btcAddress={btcAddress} />
        </HStack>
      </Stack>
    </HStack>
  );
});

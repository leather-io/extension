import { Suspense } from 'react';
import { Box, color, Stack } from '@stacks/ui';

import { LoadingRectangle } from '@app/components/loading-rectangle';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { CurrentStxAddress } from '@app/features/current-account/current-stx-address';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { Balance } from '@app/components/balance';

function PopupHeaderSuspense(): JSX.Element {
  const account = useCurrentAccount();
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentAccountAvatar size="24px" fontSize="10px" />
          <CurrentAccountName as="h3" />
          <CurrentStxAddress />
        </Stack>
        {account && <Balance address={account.address} />}
      </Stack>
    </Box>
  );
}

function PopupHeaderFallback(): JSX.Element {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentAccountAvatar size="24px" fontSize="10px" />
          <CurrentAccountName as="h3" />
          <CurrentStxAddress />
        </Stack>
        <LoadingRectangle width="72px" height="14px" />
      </Stack>
    </Box>
  );
}

export function PopupHeader(): JSX.Element {
  return (
    <Suspense fallback={<PopupHeaderFallback />}>
      <PopupHeaderSuspense />
    </Suspense>
  );
}

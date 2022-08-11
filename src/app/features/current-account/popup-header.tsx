import { Suspense } from 'react';
import { Box, color, Stack } from '@stacks/ui';

import { LoadingRectangle } from '@app/components/loading-rectangle';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { CurrentStxAddress } from '@app/features/current-account/current-stx-address';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { Balance } from '@app/components/balance';

interface PopupHeaderLayoutProps {
  children: React.ReactNode;
}
function PopupHeaderLayout({ children }: PopupHeaderLayoutProps) {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentAccountAvatar size="24px" fontSize="10px" />
          <CurrentAccountName as="h3" />
          <CurrentStxAddress />
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

function PopupHeaderSuspense() {
  const account = useCurrentAccount();
  return <PopupHeaderLayout>{account && <Balance address={account.address} />}</PopupHeaderLayout>;
}

function PopupHeaderFallback() {
  return (
    <PopupHeaderLayout>
      <LoadingRectangle width="72px" height="14px" />
    </PopupHeaderLayout>
  );
}

export function PopupHeader() {
  return (
    <Suspense fallback={<PopupHeaderFallback />}>
      <PopupHeaderSuspense />
    </Suspense>
  );
}

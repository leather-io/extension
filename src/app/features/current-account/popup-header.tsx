import { Suspense } from 'react';

import { Box, Stack, color } from '@stacks/ui';

import { Balance } from '@app/components/balance';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { CurrentStxAddress } from '@app/features/current-account/current-stx-address';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

interface PopupHeaderLayoutProps {
  children: React.ReactNode;
}
function PopupHeaderLayout({ children }: PopupHeaderLayoutProps) {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="end">
          <CurrentAccountAvatar size="24px" fontSize="10px" />
          <CurrentAccountName as="h3" />
          <CurrentStxAddress fontSize="12px" />
        </Stack>
        <Stack isInline alignItems="end" justifyContent="right">
          <NetworkModeBadge />
          {children}
        </Stack>
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

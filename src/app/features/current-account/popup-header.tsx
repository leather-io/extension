import { Suspense } from 'react';

import { Box, Stack, color } from '@stacks/ui';

import { BtcBalance } from '@app/components/balance-btc';
import { StxBalance } from '@app/components/balance-stx';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { CurrentStxAddress } from '@app/features/current-account/current-stx-address';
import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface PopupHeaderLayoutProps {
  children: React.ReactNode;
}
function PopupHeaderLayout({ children }: PopupHeaderLayoutProps) {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        {children}
      </Stack>
    </Box>
  );
}

interface PopupHeaderProps {
  displayAddresssBalanceOf?: 'all' | 'stx';
}
function PopupHeaderSuspense({ displayAddresssBalanceOf = 'stx' }: PopupHeaderProps) {
  const account = useCurrentStacksAccount();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  return (
    <PopupHeaderLayout>
      <Stack isInline alignItems="center">
        <CurrentAccountAvatar size="24px" fontSize="10px" />
        <CurrentAccountName as="h3" />
        {displayAddresssBalanceOf === 'stx' && <CurrentStxAddress />}
      </Stack>
      {account && displayAddresssBalanceOf === 'stx' && <StxBalance address={account.address} />}
      {isBitcoinEnabled && <BtcBalance />}
    </PopupHeaderLayout>
  );
}

function PopupHeaderFallback() {
  return (
    <PopupHeaderLayout>
      <LoadingRectangle width="72px" height="14px" />
    </PopupHeaderLayout>
  );
}

export function PopupHeader(props: PopupHeaderProps) {
  return (
    <Suspense fallback={<PopupHeaderFallback />}>
      <PopupHeaderSuspense {...props} />
    </Suspense>
  );
}

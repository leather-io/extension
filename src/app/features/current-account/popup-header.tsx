import { Suspense } from 'react';

import { Box, Stack, color } from '@stacks/ui';

import { BtcBalance } from '@app/components/balance-btc';
import { StxBalance } from '@app/components/balance-stx';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { CurrentStxAddress } from '@app/features/current-account/current-stx-address';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface PopupHeaderLayoutProps {
  children: React.ReactNode;
}
function PopupHeaderLayout({ children }: PopupHeaderLayoutProps) {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      {children}
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
      <Flag align="middle" img={<CurrentAccountAvatar size="24px" fontSize="10px" />}>
        <SpaceBetween>
          <Stack isInline alignItems="center">
            <CurrentAccountName as="h3" />
            {displayAddresssBalanceOf === 'stx' && <CurrentStxAddress fontSize="12px" />}
          </Stack>
          <Stack isInline alignItems="flex-end" justifyContent="right">
            <NetworkModeBadge top="4px" />
            {account && displayAddresssBalanceOf === 'stx' && (
              <StxBalance address={account.address} />
            )}
            {isBitcoinEnabled && <BtcBalance />}
          </Stack>
        </SpaceBetween>
      </Flag>
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

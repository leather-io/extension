import { Suspense } from 'react';

import { Box, HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BtcBalance } from '@app/components/balance-btc';
import { StxBalance } from '@app/components/balance-stx';
import { Flag } from '@app/components/layout/flag';
import { LoadingRectangle } from '@app/components/loading-rectangle';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface PopupHeaderLayoutProps {
  children: React.ReactNode;
}
function PopupHeaderLayout({ children }: PopupHeaderLayoutProps) {
  return (
    <Box p="space.04" width="100%" borderBottom="borders.default">
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
      <Flag
        align="middle"
        img={
          <CurrentAccountAvatar
            color={token('colors.white')}
            fontSize="16px"
            fontWeight={500}
            size="32px"
          />
        }
      >
        <HStack alignItems="center" justifyContent="space-between">
          <styled.h3>
            <CurrentAccountName />
          </styled.h3>

          <HStack alignItems="center" justifyContent="right">
            <NetworkModeBadge />
            {account && displayAddresssBalanceOf === 'stx' && (
              <StxBalance address={account.address} />
            )}
            {isBitcoinEnabled && displayAddresssBalanceOf === 'all' && <BtcBalance />}
          </HStack>
        </HStack>
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

import { Divider, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { WalletTypeLedgerIcon } from '@app/components/icons/wallet-type-ledger-icon';

interface LedgerDeviceItemRowProps {
  deviceType?: string;
}
export function LedgerDeviceItemRow({ deviceType }: LedgerDeviceItemRowProps) {
  return (
    <>
      <Flex my="space.03" mb="space.04" mx="space.04" fontSize="14px" alignItems="center">
        <WalletTypeLedgerIcon />
        <styled.span color={token('colors.accent.text-primary')} cursor="default">
          Ledger {deviceType ?? ''}
        </styled.span>
      </Flex>
      <Divider />
    </>
  );
}

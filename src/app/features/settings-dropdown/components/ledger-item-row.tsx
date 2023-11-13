import { Flex, styled } from 'leather-styles/jsx';

import { Divider } from '@app/components/layout/divider';
import { WalletTypeLedgerIcon } from '@app/ui/components/icons/wallet-type-ledger-icon';

interface LedgerDeviceItemRowProps {
  deviceType?: string;
}
export function LedgerDeviceItemRow({ deviceType }: LedgerDeviceItemRowProps) {
  return (
    <>
      <Flex my="base-tight" mb="base" mx="base" fontSize="14px" alignItems="center">
        <WalletTypeLedgerIcon mr="base-tight" />
        <styled.span cursor="default">Ledger {deviceType ?? ''}</styled.span>
      </Flex>
      <Divider />
    </>
  );
}

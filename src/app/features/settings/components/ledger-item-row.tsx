import { Flex, styled } from 'leather-styles/jsx';

import { LedgerIcon } from '@leather-wallet/ui';

import { Divider } from '@app/components/layout/divider';

interface LedgerDeviceItemRowProps {
  deviceType?: string;
}
export function LedgerDeviceItemRow({ deviceType }: LedgerDeviceItemRowProps) {
  return (
    <>
      <Flex my="space.03" mb="space.04" mx="space.04" fontSize="14px" alignItems="center">
        <LedgerIcon mr="space.03" />
        <styled.span cursor="default">Ledger {deviceType ?? ''}</styled.span>
      </Flex>
      <Divider />
    </>
  );
}

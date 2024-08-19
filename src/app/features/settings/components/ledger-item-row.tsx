import { Box, Flex, styled } from 'leather-styles/jsx';

import { LedgerIcon } from '@leather.io/ui';

import { Divider } from '@app/components/layout/divider';

interface LedgerDeviceItemRowProps {
  deviceType?: string;
}
export function LedgerDeviceItemRow({ deviceType }: LedgerDeviceItemRowProps) {
  return (
    <>
      <Flex my="space.03" mb="space.04" mx="space.04" fontSize="14px" alignItems="center">
        <Box mr="space.03">
          <LedgerIcon />
        </Box>
        <styled.span cursor="default">Ledger {deviceType ?? ''}</styled.span>
      </Flex>
      <Divider />
    </>
  );
}

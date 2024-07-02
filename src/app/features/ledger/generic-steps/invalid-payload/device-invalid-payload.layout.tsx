import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { ConnectLedgerErr } from '@app/features/ledger/illustrations/ledger-illu-connect-ledger-error';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerDeviceInvalidPayloadLayoutProps {
  onClose(): void;
}
export function LedgerDeviceInvalidPayloadLayout({
  onClose,
}: LedgerDeviceInvalidPayloadLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <ConnectLedgerErr />
      </Box>
      <styled.span mt="space.06" textStyle="label.01">
        Data Invalid
      </styled.span>
      <styled.span mt="space.03" lineHeight="24px" textStyle="caption.01">
        Your Ledger device has rejected the payload stating it is invalid
      </styled.span>
      <Flex mt="space.04">
        <Button variant="outline" mr="space.03" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </LedgerWrapper>
  );
}

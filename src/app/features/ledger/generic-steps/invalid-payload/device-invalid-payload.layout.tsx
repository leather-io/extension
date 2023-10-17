import { Box, Flex, Text, color } from '@stacks/ui';

import { LeatherButton } from '@app/components/button/button';
import { Title } from '@app/components/typography';
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
      <Title mt="extra-loose">Data Invalid</Title>
      <Text mt="base-tight" lineHeight="24px" color={color('text-caption')}>
        Your Ledger device has rejected the payload stating it is invalid
      </Text>
      <Flex mt="base-loose">
        <LeatherButton variant="ghost" mr="base-tight" onClick={onClose}>
          Close
        </LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}

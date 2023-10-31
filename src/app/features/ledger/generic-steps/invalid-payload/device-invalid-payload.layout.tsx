import { Box, Flex, Text, color } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
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

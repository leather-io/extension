import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Box, Button, Flex, Text, color } from '@stacks/ui';

import { Title } from '@app/components/typography';

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
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="extra-loose">Data Invalid</Title>
      <Text mt="base-tight" lineHeight="24px" color={color('text-caption')}>
        Your Ledger device has rejected the payload stating it is invalid
      </Text>
      <Flex mt="base-loose">
        <Button mode="tertiary" mr="base-tight" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </LedgerWrapper>
  );
}

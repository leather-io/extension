import { Box, Button, Flex, Text, color } from '@stacks/ui';

import { Title } from '@app/components/typography';
import { ConnectLedgerErr } from '@app/features/ledger/illustrations/ledger-illu-connect-ledger-error';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface PublicKeyMismatchLayoutProps {
  onClose(): void;
  onTryAgain(): void;
}
export function PublicKeyMismatchLayout({ onClose, onTryAgain }: PublicKeyMismatchLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <ConnectLedgerErr />
      </Box>
      <Title mt="extra-loose">Public key does not match</Title>
      <Text mt="base-tight" lineHeight="24px" color={color('text-caption')}>
        Ensure you're using the same Ledger you used when setting up Leather
      </Text>
      <Flex mt="base-loose">
        <Button mode="tertiary" mr="base-tight" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onTryAgain}>Try again</Button>
      </Flex>
    </LedgerWrapper>
  );
}

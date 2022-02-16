import { Box, Button, color, Flex, Text } from '@stacks/ui';
import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Title } from '@app/components/typography';
import { LedgerWrapper } from '../components/ledger-wrapper';

interface PublicKeyMismatchLayoutProps {
  onClose(): void;
  onTryAgain(): void;
}
export function PublicKeyMismatchLayout({ onClose, onTryAgain }: PublicKeyMismatchLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="extra-loose">Public key does not match</Title>
      <Text mt="base-tight" lineHeight="24px" color={color('text-caption')}>
        Ensure you're using the same Ledger you used when setting up the Hiro Wallet
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

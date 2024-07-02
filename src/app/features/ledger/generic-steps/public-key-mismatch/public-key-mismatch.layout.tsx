import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

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
      <styled.span mt="space.06" textStyle="label.01">
        Public key does not match
      </styled.span>
      <styled.span mt="space.03" lineHeight="24px" textStyle="caption.01">
        Ensure you're using the same Ledger you used when setting up Leather
      </styled.span>
      <Flex mt="space.04">
        <Button variant="outline" mr="space.03" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onTryAgain}>Try again</Button>
      </Flex>
    </LedgerWrapper>
  );
}

import { Box, Flex, styled } from 'leather-styles/jsx';

import { ConnectLedgerErr } from '@app/features/ledger/illustrations/ledger-illu-connect-ledger-error';
import { LeatherButton } from '@app/ui/components/button';

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
        <LeatherButton variant="outline" mr="space.03" onClick={onClose}>
          Close
        </LeatherButton>
        <LeatherButton onClick={onTryAgain}>Try again</LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}

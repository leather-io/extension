import { Box } from 'leather-styles/jsx';

import { LedgerTxRejected } from '@app/features/ledger/illustrations/ledger-illu-transaction-rejected';
import { LeatherButton } from '@app/ui/components/button';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerOperationRejectedLayoutProps {
  description: string;
  onClose(): void;
}
export function LedgerOperationRejectedLayout({
  onClose,
  description,
}: LedgerOperationRejectedLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <LedgerTxRejected />
      </Box>
      <LedgerTitle my="space.05">{description}</LedgerTitle>
      <LeatherButton fullWidth mb="space.01" onClick={onClose} variant="outline">
        Close
      </LeatherButton>
    </LedgerWrapper>
  );
}

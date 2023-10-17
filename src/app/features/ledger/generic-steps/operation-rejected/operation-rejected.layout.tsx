import { Box } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { LedgerTxRejected } from '@app/features/ledger/illustrations/ledger-illu-transaction-rejected';

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
      <LeatherButton width="100%" variant="outline" mb="space.01" onClick={onClose}>
        Close
      </LeatherButton>
    </LedgerWrapper>
  );
}

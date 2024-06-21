import type { SupportedBlockchains } from '@leather.io/models';

import { ConnectLedgerSuccess } from '@app/features/ledger/illustrations/ledger-illu-success';

import { LedgerConnectInstructionTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';
import { LedgerSuccessLabel } from '../../components/success-label';

interface ConnectLedgerSuccessLayoutProps {
  chain: SupportedBlockchains;
}
export function ConnectLedgerSuccessLayout({ chain }: ConnectLedgerSuccessLayoutProps) {
  return (
    <LedgerWrapper>
      <ConnectLedgerSuccess />
      <LedgerConnectInstructionTitle chain={chain} mt="space.05" mx="50px" />
      <LedgerSuccessLabel my="space.06">Connected!</LedgerSuccessLabel>
    </LedgerWrapper>
  );
}

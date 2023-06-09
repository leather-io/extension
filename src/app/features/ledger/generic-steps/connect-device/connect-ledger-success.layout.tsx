import ConnectLedgerSuccess from '@assets/images/ledger/connect-ledger-success.png';

import { SupportedBlockchains } from '@shared/constants';

import { LedgerConnectInstructionTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';
import { LedgerSuccessLabel } from '../../components/success-label';

interface ConnectLedgerSuccessLayoutProps {
  chain: SupportedBlockchains;
}
export function ConnectLedgerSuccessLayout({ chain }: ConnectLedgerSuccessLayoutProps) {
  return (
    <LedgerWrapper>
      <img src={ConnectLedgerSuccess} width="267px" height="55px" />
      <LedgerConnectInstructionTitle chain={chain} mt="loose" mx="50px" />
      <LedgerSuccessLabel my="extra-loose">Connected!</LedgerSuccessLabel>
    </LedgerWrapper>
  );
}

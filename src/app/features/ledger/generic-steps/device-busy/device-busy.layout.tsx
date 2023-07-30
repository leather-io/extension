import ConnectLedgerSuccess from '@assets/images/ledger/connect-ledger-success.png';

import { SupportedBlockchains } from '@shared/constants';

import { LedgerConnectInstructionTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';
import { LookingForLedgerLabel } from '../../components/looking-for-ledger-label';

interface DeviceBusyLayoutProps {
  activityDescription: string;
  chain: SupportedBlockchains;
}
export function DeviceBusyLayout(props: DeviceBusyLayoutProps) {
  const { activityDescription, chain } = props;

  return (
    <LedgerWrapper>
      <img src={ConnectLedgerSuccess} width="267px" height="55px" />
      <LedgerConnectInstructionTitle chain={chain} mt="loose" mx="50px" />
      <LookingForLedgerLabel my="extra-loose">{activityDescription}</LookingForLedgerLabel>
    </LedgerWrapper>
  );
}

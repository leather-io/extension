import ConnectLedgerSuccess from '@assets/images/ledger/connect-ledger-success.png';
import { LookingForLedgerLabel } from '../components/looking-for-ledger-label';
import { LedgerConnectInstructionTitle } from '../components/ledger-title';
import { LedgerWrapper } from '../components/ledger-wrapper';

interface DeviceBusyLayoutProps {
  activityDescription: string;
}
export function DeviceBusyLayout(props: DeviceBusyLayoutProps) {
  const { activityDescription } = props;

  return (
    <LedgerWrapper>
      <img src={ConnectLedgerSuccess} width="267px" height="55px" />
      <LedgerConnectInstructionTitle mt="loose" mx="50px" />
      <LookingForLedgerLabel my="extra-loose">{activityDescription}</LookingForLedgerLabel>
    </LedgerWrapper>
  );
}

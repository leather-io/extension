import { ConnectLedgerSuccess } from '@app/features/ledger/illustrations/ledger-illu-success';

import { LedgerWrapper } from '../../components/ledger-wrapper';
import { LookingForLedgerLabel } from '../../components/looking-for-ledger-label';

interface DeviceBusyLayoutProps {
  activityDescription: string;
}
export function DeviceBusyLayout(props: DeviceBusyLayoutProps) {
  const { activityDescription } = props;

  return (
    <LedgerWrapper>
      <ConnectLedgerSuccess />
      <LookingForLedgerLabel my="space.06">{activityDescription}</LookingForLedgerLabel>
    </LedgerWrapper>
  );
}

import { LookingForLedgerLabel } from './looking-for-ledger-label';
import { LedgerSuccessLabel } from './success-label';

interface DeviceOperationApprovalStatusProps {
  status: 'awaiting-approval' | 'approved';
}
export function DeviceOperationApprovalStatus({ status }: DeviceOperationApprovalStatusProps) {
  if (status === 'awaiting-approval')
    return <LookingForLedgerLabel my="space.06">Waiting for your approval</LookingForLedgerLabel>;

  return <LedgerSuccessLabel my="space.06">Approved</LedgerSuccessLabel>;
}

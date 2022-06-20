import { LookingForLedgerLabel } from './looking-for-ledger-label';
import { LedgerSuccessLabel } from './success-label';

interface DeviceOperationApprovalStatusProps {
  status: 'awaiting-approval' | 'approved';
}
export function DeviceOperationApprovalStatus({ status }: DeviceOperationApprovalStatusProps) {
  if (status === 'awaiting-approval')
    return (
      <LookingForLedgerLabel my="extra-loose">Waiting for your approval</LookingForLedgerLabel>
    );

  return <LedgerSuccessLabel my="extra-loose">Approved</LedgerSuccessLabel>;
}

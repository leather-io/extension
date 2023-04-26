import { PrimaryButton } from '@app/components/primary-button';

import { SendTransferFooter } from './send-transfer-footer';

interface SendTransferActionsProps {
  action: string;
  isLoading?: boolean;
  onApprove(): void;
}
export function SendTransferActions({ action, isLoading, onApprove }: SendTransferActionsProps) {
  return (
    <SendTransferFooter>
      <PrimaryButton borderRadius="10px" flexGrow={1} isLoading={isLoading} onClick={onApprove}>
        {action}
      </PrimaryButton>
    </SendTransferFooter>
  );
}

import { LeatherButton } from '@app/ui/components/button';

import { SendTransferFooter } from './send-transfer-footer';

interface SendTransferActionsProps {
  action: string;
  isLoading?: boolean;
  onApprove(): void;
}
export function SendTransferActions({ action, isLoading, onApprove }: SendTransferActionsProps) {
  return (
    <SendTransferFooter>
      <LeatherButton borderRadius="10px" flexGrow={1} aria-busy={isLoading} onClick={onApprove}>
        {action}
      </LeatherButton>
    </SendTransferFooter>
  );
}

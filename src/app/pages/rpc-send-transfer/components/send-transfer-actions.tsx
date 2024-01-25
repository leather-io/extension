import { Button } from '@app/ui/components/button/button';

import { SendTransferFooter } from './send-transfer-footer';

interface SendTransferActionsProps {
  action: string;
  isLoading?: boolean;
  onApprove(): void;
}
export function SendTransferActions({ action, isLoading, onApprove }: SendTransferActionsProps) {
  return (
    <SendTransferFooter>
      <Button borderRadius="sm" flexGrow={1} aria-busy={isLoading} onClick={onApprove}>
        {action}
      </Button>
    </SendTransferFooter>
  );
}

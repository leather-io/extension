import { RouteUrls } from '@shared/route-urls';

import { IncreaseFeeField } from './components/increase-fee-field';
import { useStxCancelTransaction } from './hooks/use-stx-cancel-transaction';
import { StxTransactionActionDialog } from './stx-transaction-action-dialog';

export function CancelStxTransactionDialog() {
  return (
    <StxTransactionActionDialog
      title="Cancel transaction"
      description="Cancelling a transaction isn't guaranteed to work. A higher fee can help replace the old transaction."
      routeUrl={RouteUrls.CancelStxTransaction}
      useActionHook={useStxCancelTransaction}
      FeeComponent={IncreaseFeeField}
      isCancel={true}
    />
  );
}

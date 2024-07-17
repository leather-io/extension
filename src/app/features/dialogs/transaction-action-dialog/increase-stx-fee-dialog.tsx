import { RouteUrls } from '@shared/route-urls';

import { IncreaseFeeField } from './components/increase-fee-field';
import { useStxIncreaseFee } from './hooks/use-stx-increase-fee';
import { StxTransactionActionDialog } from './stx-transaction-action-dialog';

export function IncreaseStxFeeDialog() {
  return (
    <StxTransactionActionDialog
      title="Increase fee"
      description="If your transaction is pending for a long time, its fee might not be high enough to be included in a block. Update the fee for a higher value and try again."
      routeUrl={RouteUrls.IncreaseStxFee}
      useActionHook={useStxIncreaseFee}
      FeeComponent={IncreaseFeeField}
    />
  );
}

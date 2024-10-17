import { RouteUrls } from '@shared/route-urls';

import { IncreaseFeeField } from './components/increase-fee-field';
import {
  StacksTransactionActionSheet,
  StacksTransactionActionSheetLoader,
} from './stacks-transaction-action-sheet';

export function IncreaseStacksTransactionFeeSheet() {
  return (
    <StacksTransactionActionSheetLoader>
      {txid => (
        <StacksTransactionActionSheet
          txid={txid}
          title="Increase fee"
          description="If your transaction is pending for a long time, its fee might not be high enough to be included in a block. Update the fee for a higher value and try again."
          routeUrl={RouteUrls.IncreaseStacksFee}
          actionType="increaseFee"
          FeeComponent={IncreaseFeeField}
        />
      )}
    </StacksTransactionActionSheetLoader>
  );
}

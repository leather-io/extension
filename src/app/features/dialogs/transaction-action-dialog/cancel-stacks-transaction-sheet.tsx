import { RouteUrls } from '@shared/route-urls';

import { IncreaseFeeField } from './components/increase-fee-field';
import {
  StacksTransactionActionSheet,
  StacksTransactionActionSheetLoader,
} from './stacks-transaction-action-sheet';

export function CancelStacksTransactionSheet() {
  return (
    <StacksTransactionActionSheetLoader>
      {txid => (
        <StacksTransactionActionSheet
          txid={txid}
          title="Cancel transaction"
          description="Cancelling a transaction isn't guaranteed to work. A higher fee can help replace the old transaction."
          routeUrl={RouteUrls.CancelStacksTransaction}
          actionType="cancel"
          FeeComponent={IncreaseFeeField}
        />
      )}
    </StacksTransactionActionSheetLoader>
  );
}

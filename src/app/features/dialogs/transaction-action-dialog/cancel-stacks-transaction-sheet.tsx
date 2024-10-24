import { RouteUrls } from '@shared/route-urls';

import {
  StacksTransactionActionSheet,
  StacksTransactionActionSheetLoader,
} from './stacks-transaction-action-sheet';

export function CancelStacksTransactionSheet() {
  return (
    <StacksTransactionActionSheetLoader>
      {({ txid, rawTx, tx }) => (
        <StacksTransactionActionSheet
          txid={txid}
          rawTx={rawTx}
          tx={tx}
          title="Cancel transaction"
          description="Cancelling a transaction isn't guaranteed to work. A higher fee can help replace the old transaction."
          routeUrl={RouteUrls.CancelStacksTransaction}
          actionType="cancel"
        />
      )}
    </StacksTransactionActionSheetLoader>
  );
}

import { RouteUrls } from '@shared/route-urls';

import { StacksTransactionActionType } from '@app/common/transactions/stacks/transaction.utils';

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
          description="Cancelling a transaction isn't guaranteed to work. To cancel the transaction we replace it with a minimal STX transfer."
          routeUrl={RouteUrls.CancelStacksTransaction}
          actionType={StacksTransactionActionType.Cancel}
        />
      )}
    </StacksTransactionActionSheetLoader>
  );
}

import { RouteUrls } from '@shared/route-urls';

import {
  StacksTransactionActionSheet,
  StacksTransactionActionSheetLoader,
} from './stacks-transaction-action-sheet';

export function IncreaseStacksTransactionFeeSheet() {
  return (
    <StacksTransactionActionSheetLoader>
      {({ txid, rawTx, tx }) => (
        <StacksTransactionActionSheet
          tx={tx}
          txid={txid}
          title="Increase fee"
          description="If your transaction is pending for a long time, its fee might not be high enough to be included in a block. Update the fee for a higher value and try again."
          routeUrl={RouteUrls.IncreaseStacksFee}
          actionType="increaseFee"
          rawTx={rawTx}
        />
      )}
    </StacksTransactionActionSheetLoader>
  );
}

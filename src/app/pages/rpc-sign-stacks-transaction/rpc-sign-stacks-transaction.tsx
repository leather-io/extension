import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useRpcSignStacksTransaction } from '@app/pages/rpc-sign-stacks-transaction/use-rpc-sign-stacks-transaction';

export function RpcSignStacksTransaction() {
  const {
    onSignStacksTransaction,
    onCancel,
    disableFeeSelection,
    stacksTransaction,
    disableNonceSelection,
  } = useRpcSignStacksTransaction();

  return (
    <StacksTransactionSigner
      onSignStacksTransaction={onSignStacksTransaction}
      onCancel={onCancel}
      stacksTransaction={stacksTransaction}
      disableFeeSelection={disableFeeSelection}
      disableNonceSelection={disableNonceSelection}
    />
  );
}

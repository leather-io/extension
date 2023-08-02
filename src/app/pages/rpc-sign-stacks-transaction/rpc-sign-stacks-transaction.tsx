import { StacksTransactionProvider } from '@app/features/stacks-transaction-request/components/stacks-transaction.context';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useRpcSignStacksTransaction } from '@app/pages/rpc-sign-stacks-transaction/use-rpc-sign-stacks-transaction';

export function RpcSignStacksTransaction() {
  const {
    onSignStacksTransaction,
    onCancel,
    transactionRequest,
    disableFeeSelection,
    stacksTransaction,
    disableNonceSelection,
  } = useRpcSignStacksTransaction();
  if (!transactionRequest) return null;

  return (
    <StacksTransactionProvider value={transactionRequest}>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        onCancel={onCancel}
        stacksTransaction={stacksTransaction}
        disableFeeSelection={disableFeeSelection}
        disableNonceSelection={disableNonceSelection}
      />
    </StacksTransactionProvider>
  );
}

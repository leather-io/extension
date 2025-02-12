import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useRpcStxSignTransaction } from '@app/pages/rpc-stx-sign-transaction/use-rpc-stx-sign-transaction';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

export function RpcStxSignTransaction() {
  const {
    onSignStacksTransaction,
    disableFeeSelection,
    stacksTransaction,
    disableNonceSelection,
    isMultisig,
    txSender,
  } = useRpcStxSignTransaction();

  useBreakOnNonCompliantEntity(txSender);

  return (
    <StacksHighFeeWarningContainer>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        isMultisig={isMultisig}
        stacksTransaction={stacksTransaction}
        disableFeeSelection={disableFeeSelection}
        disableNonceSelection={disableNonceSelection}
      />
    </StacksHighFeeWarningContainer>
  );
}

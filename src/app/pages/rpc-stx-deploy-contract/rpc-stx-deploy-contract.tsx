import { stxDeployContract } from '@leather.io/rpc';

import { useRpcSip30BroadcastTransaction } from '@app/common/rpc/use-rpc-sip30-broadcast-transaction';
import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

export function RpcStxDeployContract() {
  const { onSignStacksTransaction, stacksTransaction, txSender } = useRpcSip30BroadcastTransaction(
    stxDeployContract.method
  );

  useBreakOnNonCompliantEntity(txSender);

  return (
    <StacksHighFeeWarningContainer>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        isMultisig={false}
        stacksTransaction={stacksTransaction}
      />
    </StacksHighFeeWarningContainer>
  );
}

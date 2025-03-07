import { stxDeployContract } from '@leather.io/rpc';

import { useLegacyRequestBroadcastTransaction } from '@app/common/rpc/use-legacy-request-broadcast-transaction';
import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

export function RpcStxDeployContract() {
  const { onSignStacksTransaction, stacksTransaction, txSender } =
    useLegacyRequestBroadcastTransaction(stxDeployContract.method);

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

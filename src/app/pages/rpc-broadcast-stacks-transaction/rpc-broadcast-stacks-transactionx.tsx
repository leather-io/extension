import type { RpcMethodNames } from '@leather.io/rpc';

import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

import { useRpcBroadcastStacksTransaction } from './use-rpc-broadcast-stacks-transaction';

interface RpcBroadcastStacksTransactionProps {
  method: RpcMethodNames;
}
export function RpcBroadcastStacksTransaction({ method }: RpcBroadcastStacksTransactionProps) {
  const { onSignStacksTransaction, onCancel, stacksTransaction, txSender } =
    useRpcBroadcastStacksTransaction(method);

  useBreakOnNonCompliantEntity(txSender);

  return (
    <StacksHighFeeWarningContainer>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        onCancel={onCancel}
        isMultisig={false}
        stacksTransaction={stacksTransaction}
      />
    </StacksHighFeeWarningContainer>
  );
}

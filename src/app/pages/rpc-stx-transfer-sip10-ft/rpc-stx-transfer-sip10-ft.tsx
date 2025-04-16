import { stxTransferSip10Ft } from '@leather.io/rpc';
import { isDefined } from '@leather.io/utils';

import { useLegacyRequestBroadcastTransaction } from '@app/common/legacy-requests';
import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

export function RpcStxTransferSip10Ft() {
  const { onSignStacksTransaction, stacksTransaction, txPayload, txSender } =
    useLegacyRequestBroadcastTransaction(stxTransferSip10Ft.method);
  const recipient = 'recipient' in txPayload ? txPayload.recipient : '';

  useBreakOnNonCompliantEntity([txSender, recipient].filter(isDefined));

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

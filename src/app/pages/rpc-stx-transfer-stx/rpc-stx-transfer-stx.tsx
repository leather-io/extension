import { isDefined } from '@leather.io/utils';

import { StacksHighFeeWarningContainer } from '@app/features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useRpcStxTransferStx } from './use-rpc-stx-transfer-stx';

export function RpcStxTransferStx() {
  const { params, onCancel } = useRpcStxTransferStx();

  // Grab account details from store
  const currentStacksAccount = useCurrentStacksAccount();
  useBreakOnNonCompliantEntity([currentStacksAccount?.address, params.recipient].filter(isDefined));

  return (
    <StacksHighFeeWarningContainer>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        onCancel={onCancel}
        isMultisig={false}
        stacksTransaction={stacksTransaction}
        disableFeeSelection={true}
        disableNonceSelection={true}
      />
    </StacksHighFeeWarningContainer>
  );
}

import { stxCallContract } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';
import { createMoney } from '@leather.io/utils';

import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/hooks/use-sign-and-broadcast-stacks-transaction';
import { PostConditionsDetailsLayout } from '@app/features/rpc-transaction-request/post-conditions/post-conditions-details.layout';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions-with-spend';

import { ContractCallDetailsLayout } from './components/contract-call-details.layout';
import { useRpcStxCallContractContext } from './rpc-stx-call-contract.context';

export function RpcStxCallContract() {
  const { txOptions } = useRpcStxCallContractContext();
  const { isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(stxCallContract.method);

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(txOptions);
    if (selectedFee.txFee) unsignedTx.setFee(selectedFee.txFee.amount.toNumber());
    unsignedTx.setNonce(nonce);
    await signAndBroadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title={txOptions.postConditions?.length ? 'Sign transaction' : 'Sign contract'}
      method={stxCallContract.method}
      actions={
        <TransactionActionsWithSpend
          txAmount={createMoney(0, 'STX')}
          onApprove={onApproveTransaction}
        />
      }
    >
      <PostConditionsDetailsLayout txOptions={txOptions} />
      <ContractCallDetailsLayout txOptions={txOptions} />
      <FeeEditor.Trigger
        feeType="fee-value"
        isLoading={isLoadingFees}
        marketData={marketData}
        onEditFee={onUserActivatesFeeEditor}
        selectedFee={selectedFee}
      />
      <NonceEditor.Trigger nonce={nonce} onEditNonce={onUserActivatesNonceEditor} />
    </RpcTransactionRequestLayout>
  );
}

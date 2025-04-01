import { stxCallContract } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';

import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { useRpcBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/hooks/use-rpc-broadcast-stacks-transaction';
import {
  type RpcCallContractRequestContext,
  useRpcTransactionRequestContext,
} from '@app/features/rpc-transaction-request/rpc-transaction-request.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';

import { ContractCallDetailsLayout } from './components/contract-call-details.layout';
import { PostConditionsDetailsLayout } from './components/post-conditions-details.layout';

export function RpcStxCallContract() {
  const { isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const { rpcRequest } = useRpcTransactionRequestContext<RpcCallContractRequestContext>();
  const broadcastTransaction = useRpcBroadcastStacksTransaction(stxCallContract.method);

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(rpcRequest.txOptions);
    if (selectedFee.txFee) unsignedTx.setFee(selectedFee.txFee.amount.toNumber());
    unsignedTx.setNonce(nonce);
    await broadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title={rpcRequest.txOptions.postConditions?.length ? 'Sign transaction' : 'Sign contract'}
      totalSpend={selectedFee.txFee}
      onApprove={onApproveTransaction}
    >
      <PostConditionsDetailsLayout />
      <ContractCallDetailsLayout />
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

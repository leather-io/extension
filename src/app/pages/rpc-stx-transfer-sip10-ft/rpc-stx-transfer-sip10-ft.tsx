import { useMemo } from 'react';

import { stxTransferSip10Ft } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';
import { createMoneyFromDecimal } from '@leather.io/utils';

import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { ContractCallDetailsLayout } from '@app/features/rpc-transaction-request/stacks/contract-call-details.layout';
import { PostConditionsDetailsLayout } from '@app/features/rpc-transaction-request/stacks/post-conditions/post-conditions-details.layout';
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/stacks/use-sign-and-broadcast-stacks-transaction';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions-with-spend';

import { useRpcStxTransferSip10FtContext } from './rpc-stx-transfer-sip10-ft.context';
import { getStacksUnsignedContractCallOptions } from './rpc-stx-transfer-sip10-ft.utils';

export function RpcStxTransferSip10Ft() {
  const { address, isLoadingBalance, rpcRequest, network, publicKey } =
    useRpcStxTransferSip10FtContext();
  const { isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(
    stxTransferSip10Ft.method
  );

  const txOptionsForBroadcast = useMemo(
    () =>
      getStacksUnsignedContractCallOptions({
        address,
        fee: selectedFee.txFee,
        network,
        nonce,
        publicKey,
      }),
    [address, network, nonce, publicKey, selectedFee.txFee]
  );

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(txOptionsForBroadcast);
    if (selectedFee.txFee) unsignedTx.setFee(selectedFee.txFee.amount.toNumber());
    unsignedTx.setNonce(nonce);
    await signAndBroadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title="Sign transaction"
      method={stxTransferSip10Ft.method}
      helpUrl="" // TODO: Need url
      actions={
        <TransactionActionsWithSpend
          isLoading={isLoadingBalance || isLoadingFees}
          txAmount={createMoneyFromDecimal(rpcRequest.params.amount, 'STX')}
          onApprove={onApproveTransaction}
        />
      }
    >
      <PostConditionsDetailsLayout txOptions={txOptionsForBroadcast} />
      <ContractCallDetailsLayout txOptions={txOptionsForBroadcast} />
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

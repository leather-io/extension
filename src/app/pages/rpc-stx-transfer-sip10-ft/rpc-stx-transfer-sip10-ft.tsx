import { useMemo } from 'react';

import { stxTransferSip10Ft } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';
import { createMoneyFromDecimal } from '@leather.io/utils';

import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { ContractCallDetailsLayout } from '@app/features/rpc-transaction-request/stacks/contract-call/contract-call-details.layout';
import { PostConditionsDetailsLayout } from '@app/features/rpc-transaction-request/stacks/post-conditions/post-conditions-details.layout';
import { useStacksRpcTransactionRequestContext } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/stacks/use-sign-and-broadcast-stacks-transaction';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions/transaction-actions-with-spend';

import {
  getDecodedRpcStxTransferSip10FtRequest,
  getUnsignedStacksContractCallOptions,
} from './rpc-stx-transfer-sip10-ft.utils';

export function RpcStxTransferSip10Ft() {
  const { address, isLoadingBalance, network, publicKey } = useStacksRpcTransactionRequestContext();
  const { isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(
    stxTransferSip10Ft.method
  );

  const rpcRequest = useMemo(() => getDecodedRpcStxTransferSip10FtRequest(), []);
  const txOptionsForBroadcast = useMemo(
    () =>
      getUnsignedStacksContractCallOptions({
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

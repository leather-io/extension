import { useMemo } from 'react';

import { stxDeployContract } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';
import { createMoneyFromDecimal } from '@leather.io/utils';

import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { ContractDeployDetailsLayout } from '@app/features/rpc-transaction-request/stacks/contract-deploy-details.layout';
import { PostConditionsDetailsLayout } from '@app/features/rpc-transaction-request/stacks/post-conditions/post-conditions-details.layout';
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/stacks/use-sign-and-broadcast-stacks-transaction';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions-with-spend';

import { useRpcStxDeployContractContext } from './rpc-stx-deploy-contract.context';
import { getUnsignedStacksDeployContractOptions } from './rpc-stx-deploy-contract.utils';

export function RpcStxDeployContract() {
  const { address, isLoadingBalance, network, publicKey } = useRpcStxDeployContractContext();
  const { isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(
    stxDeployContract.method
  );

  const txOptionsForBroadcast = useMemo(
    () =>
      getUnsignedStacksDeployContractOptions({
        fee: selectedFee.txFee,
        network,
        nonce,
        publicKey,
      }),
    [network, nonce, publicKey, selectedFee.txFee]
  );

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(txOptionsForBroadcast);
    await signAndBroadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title="Deploy contract"
      method={stxDeployContract.method}
      helpUrl="" // TODO: Need url
      actions={
        <TransactionActionsWithSpend
          isLoading={isLoadingBalance || isLoadingFees}
          txAmount={createMoneyFromDecimal(0, 'STX')}
          onApprove={onApproveTransaction}
        />
      }
    >
      <PostConditionsDetailsLayout txOptions={txOptionsForBroadcast} />
      <ContractDeployDetailsLayout address={address} txOptions={txOptionsForBroadcast} />
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

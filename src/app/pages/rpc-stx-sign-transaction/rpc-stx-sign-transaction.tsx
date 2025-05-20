import { useMemo } from 'react';

import {
  addressToString,
  isContractCallPayload,
  isSmartContractPayload,
  isTokenTransferPayload,
  serializeCV,
} from '@stacks/transactions';

import {
  RpcErrorCode,
  createRpcErrorResponse,
  createRpcSuccessResponse,
  stxSignTransaction,
} from '@leather.io/rpc';
import { StxAvatarIcon } from '@leather.io/ui';
import { createMoney, isString } from '@leather.io/utils';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { AccountStacksAddress } from '@app/components/account/account-stacks-address';
import { TransactionRecipientsLayout } from '@app/components/rpc-transaction-request/transaction-recipients.layout';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { ContractCallDetailsLayout } from '@app/features/rpc-transaction-request/stacks/contract-call/contract-call-details.layout';
import { ContractDeployDetailsLayout } from '@app/features/rpc-transaction-request/stacks/contract-deploy/contract-deploy-details.layout';
import { PostConditionsDetailsLayout } from '@app/features/rpc-transaction-request/stacks/post-conditions/post-conditions-details.layout';
import { useStacksRpcTransactionRequestContext } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { TransactionAccountSigner } from '@app/features/rpc-transaction-request/transaction-account-signer/transaction-account-signer';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions/transaction-actions-with-spend';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import {
  checkUnsignedStacksTransactionFee,
  checkUnsignedStacksTransactionHashMode,
  checkUnsignedStacksTransactionNonce,
  getUnsignedStacksTransactionFromRpcRequest,
} from './rpc-stx-sign-transaction.utils';

export function RpcStxSignTransaction() {
  const { address, isLoadingBalance, requestId, tabId } = useStacksRpcTransactionRequestContext();
  const { availableBalance, isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('STX');
  const signStacksTx = useSignStacksTransaction();

  const unsignedTxForBroadcast = useMemo(() => getUnsignedStacksTransactionFromRpcRequest(), []);
  const txRequestHasAlreadySetFee = checkUnsignedStacksTransactionFee(unsignedTxForBroadcast);
  const txRequestHasAlreadySetNonce = checkUnsignedStacksTransactionNonce(unsignedTxForBroadcast);

  // Handle multisig transactions
  const isMultisig = checkUnsignedStacksTransactionHashMode(unsignedTxForBroadcast);
  const txRequestWasAlreadySignedByOthers =
    isMultisig &&
    'fields' in unsignedTxForBroadcast.auth.spendingCondition &&
    unsignedTxForBroadcast.auth.spendingCondition.fields.length > 0;
  const enableFeeEditor = !(txRequestWasAlreadySignedByOthers || txRequestHasAlreadySetFee);
  const enableNonceEditor = !(txRequestWasAlreadySignedByOthers || txRequestHasAlreadySetNonce);

  async function onApproveTransaction() {
    if (!txRequestHasAlreadySetFee)
      unsignedTxForBroadcast.setFee(selectedFee.txFee.amount.toString());
    if (!txRequestHasAlreadySetNonce) unsignedTxForBroadcast.setNonce(nonce);

    const signedTransaction = await signStacksTx(unsignedTxForBroadcast);

    if (!signedTransaction) {
      chrome.tabs.sendMessage(
        tabId,
        createRpcErrorResponse('stx_signTransaction', {
          id: requestId,
          error: {
            code: RpcErrorCode.INVALID_REQUEST,
            message: RpcErrorMessage.UnsignedTransaction,
          },
        })
      );
      throw new Error('Error signing stacks transaction');
    }

    chrome.tabs.sendMessage(
      tabId,
      createRpcSuccessResponse('stx_signTransaction', {
        id: requestId,
        result: {
          txHex: signedTransaction.serialize(),
          transaction: signedTransaction.serialize(),
        },
      })
    );
    closeWindow();
  }

  return (
    <RpcTransactionRequestLayout
      title="Sign transaction"
      method={stxSignTransaction.method}
      helpUrl="" // TODO: Need url
      actions={
        <TransactionActionsWithSpend
          isLoading={isLoadingBalance || isLoadingFees}
          // TODO: Calculate amount if more than fees
          txAmount={createMoney(0, 'STX')}
          onApprove={onApproveTransaction}
        />
      }
    >
      {isTokenTransferPayload(unsignedTxForBroadcast.payload) ? (
        <>
          <TransactionAccountSigner
            address={<AccountStacksAddress />}
            availableBalance={availableBalance}
            fiatBalance={convertToFiatAmount(availableBalance)}
            isLoadingBalance={isLoadingBalance}
          />
          <TransactionRecipientsLayout
            title="Stacks"
            caption="Stacks blockchain"
            avatar={<StxAvatarIcon />}
            convertToFiatAmount={convertToFiatAmount}
            recipients={[
              {
                address: isString(unsignedTxForBroadcast.payload.recipient)
                  ? unsignedTxForBroadcast.payload.recipient
                  : unsignedTxForBroadcast.payload.recipient.value,
                amount: createMoney(unsignedTxForBroadcast.payload.amount, 'STX'),
              },
            ]}
          />
        </>
      ) : (
        <PostConditionsDetailsLayout
          postConditions={unsignedTxForBroadcast.postConditions.values}
          postConditionMode={unsignedTxForBroadcast.postConditionMode}
        />
      )}
      {isContractCallPayload(unsignedTxForBroadcast.payload) && (
        <ContractCallDetailsLayout
          contractAddress={addressToString(unsignedTxForBroadcast.payload.contractAddress)}
          contractName={unsignedTxForBroadcast.payload.contractName.content}
          functionName={unsignedTxForBroadcast.payload.functionName.content}
          functionArgs={unsignedTxForBroadcast.payload.functionArgs.map(arg => serializeCV(arg))}
        />
      )}
      {isSmartContractPayload(unsignedTxForBroadcast.payload) && (
        <ContractDeployDetailsLayout
          address={address}
          contractName={unsignedTxForBroadcast.payload.contractName.content}
          codeBody={unsignedTxForBroadcast.payload.codeBody.content}
        />
      )}
      {enableFeeEditor && (
        <FeeEditor.Trigger
          feeType="fee-value"
          isLoading={isLoadingFees}
          marketData={marketData}
          onEditFee={onUserActivatesFeeEditor}
          selectedFee={selectedFee}
        />
      )}
      {enableNonceEditor && (
        <NonceEditor.Trigger nonce={nonce} onEditNonce={onUserActivatesNonceEditor} />
      )}
    </RpcTransactionRequestLayout>
  );
}

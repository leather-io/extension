import { useMemo } from 'react';

import { stxTransferStx } from '@leather.io/rpc';
import { generateStacksUnsignedTransaction } from '@leather.io/stacks';
import { StxAvatarIcon } from '@leather.io/ui';
import { isString } from '@leather.io/utils';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { AccountStacksAddress } from '@app/components/account/account-stacks-address';
import { TransactionRecipientsLayout } from '@app/components/rpc-transaction-request/transaction-recipients.layout';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { RpcTransactionRequestLayout } from '@app/features/rpc-stacks-transaction-request/rpc-transaction-request.layout';
import { SigningAccountCard } from '@app/features/rpc-stacks-transaction-request/signing-account-card/signing-account-card';
import { useStacksRpcTransactionRequestContext } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-stacks-transaction-request/stacks/use-sign-and-broadcast-stacks-transaction';
import { TransactionActionsWithSpend } from '@app/features/rpc-stacks-transaction-request/transaction-actions/transaction-actions-with-spend';

import { getUnsignedStacksTokenTransferOptions } from './rpc-stx-transfer-stx.utils';

export function RpcStxTransferStx() {
  const { isLoadingBalance, network, publicKey } = useStacksRpcTransactionRequestContext();
  const {
    availableBalance,
    isLoadingFees,
    isSponsored,
    marketData,
    onUserActivatesFeeEditor,
    selectedFee,
  } = useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(stxTransferStx.method);
  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('STX');

  const txOptionsForBroadcast = useMemo(
    () =>
      getUnsignedStacksTokenTransferOptions({
        fee: selectedFee.txFee,
        network,
        nonce,
        publicKey,
      }),
    [network, nonce, publicKey, selectedFee.txFee]
  );

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(txOptionsForBroadcast);
    if (isSponsored) unsignedTx.setFee(0);
    await signAndBroadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title="Send token"
      method={stxTransferStx.method}
      helpUrl="https://leather.io/guides/send-stacks-from-app"
      actions={
        <TransactionActionsWithSpend
          isLoading={isLoadingBalance || isLoadingFees}
          isSponsored={isSponsored}
          txAmount={txOptionsForBroadcast.amount}
          onApprove={onApproveTransaction}
        />
      }
    >
      <SigningAccountCard
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
            address: isString(txOptionsForBroadcast.recipient)
              ? txOptionsForBroadcast.recipient
              : txOptionsForBroadcast.recipient.value,
            amount: txOptionsForBroadcast.amount,
          },
        ]}
      />
      <FeeEditor.Trigger
        feeType="fee-value"
        isLoading={isLoadingFees}
        isSponsored={isSponsored}
        marketData={marketData}
        onEditFee={onUserActivatesFeeEditor}
        selectedFee={selectedFee}
      />
      <NonceEditor.Trigger nonce={nonce} onEditNonce={onUserActivatesNonceEditor} />
    </RpcTransactionRequestLayout>
  );
}

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
import { useSignAndBroadcastStacksTransaction } from '@app/features/rpc-transaction-request/hooks/use-sign-and-broadcast-stacks-transaction';
import { RpcTransactionRequestLayout } from '@app/features/rpc-transaction-request/rpc-transaction-request.layout';
import { SwitchAccountTrigger } from '@app/features/rpc-transaction-request/switch-account-trigger/switch-account-trigger';
import { TransactionActionsWithSpend } from '@app/features/rpc-transaction-request/transaction-actions-with-spend';

import { useRpcStxTransferStxContext } from './rpc-stx-transfer-stx.context';

export function RpcStxTransferStx() {
  const { isLoading, onUserActivatesSwitchAccount, txOptions } = useRpcStxTransferStxContext();
  const { availableBalance, isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const signAndBroadcastTransaction = useSignAndBroadcastStacksTransaction(stxTransferStx.method);
  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('STX');

  async function onApproveTransaction() {
    const unsignedTx = await generateStacksUnsignedTransaction(txOptions);
    if (selectedFee.txFee) unsignedTx.setFee(selectedFee.txFee.amount.toNumber());
    unsignedTx.setNonce(nonce);
    await signAndBroadcastTransaction(unsignedTx);
  }

  return (
    <RpcTransactionRequestLayout
      title="Send token"
      method={stxTransferStx.method}
      helpUrl="https://leather.io/guides/send-stacks-from-app"
      actions={
        <TransactionActionsWithSpend txAmount={txOptions.amount} onApprove={onApproveTransaction} />
      }
    >
      <SwitchAccountTrigger
        address={<AccountStacksAddress />}
        availableBalance={availableBalance}
        fiatBalance={convertToFiatAmount(availableBalance)}
        isLoadingBalance={isLoading}
        onSwitchAccount={onUserActivatesSwitchAccount}
      />
      <TransactionRecipientsLayout
        title="Stacks"
        caption="Stacks blockchain"
        avatar={<StxAvatarIcon />}
        convertToFiatAmount={convertToFiatAmount}
        recipients={[
          {
            address: isString(txOptions.recipient)
              ? txOptions.recipient
              : txOptions.recipient.value,
            amount: txOptions.amount,
          },
        ]}
      />
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

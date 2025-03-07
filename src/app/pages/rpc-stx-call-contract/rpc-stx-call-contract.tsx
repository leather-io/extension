import { Outlet } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { stxCallContract } from '@leather.io/rpc';
import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

import { useRpcBroadcastStacksTransaction } from '@app/common/rpc/use-rpc-broadcast-stacks-transaction';
import { ApproveTransactionError } from '@app/components/approve-transaction/approve-transaction-error';
import { ApproveTransactionHeader } from '@app/components/approve-transaction/approve-transaction-header';
import { ApproveTransactionActionsTitle } from '@app/components/approve-transaction/approve-transaction-title';
import { ApproveTransactionWrapper } from '@app/components/approve-transaction/approve-transaction-wrapper';
import { getApproveTransactionActions } from '@app/components/approve-transaction/get-approve-transaction-actions';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { NonceEditor } from '@app/features/nonce-editor/nonce-editor';
import { useNonceEditorContext } from '@app/features/nonce-editor/nonce-editor.context';
import { useRpcRequestContext } from '@app/features/rpc-request/rpc-request.context';
import { useUiState } from '@app/store/ui/ui.slice';

import type { RpcCallContractRequest } from './rpc-stx-call-contract-container';

export function RpcStxCallContract() {
  const { availableBalance, isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { nonce, onUserActivatesNonceEditor } = useNonceEditorContext();
  const { isLoadingData, origin, onClickRequestedByLink, rpcRequest } =
    useRpcRequestContext<RpcCallContractRequest>();
  const broadcastTransaction = useRpcBroadcastStacksTransaction(stxCallContract.method);
  const { isBroadcasting, isSubmitted } = useUiState();

  const showOverlay = isBroadcasting || isSubmitted;
  const isInsufficientBalance = !!(
    selectedFee.feeValue && availableBalance.amount.isLessThan(selectedFee.feeValue.amount)
  );

  return (
    <>
      <ApproveTransactionWrapper showOverlay={showOverlay}>
        <Approver requester={origin} width="100%">
          <Box position="relative">
            <BackgroundOverlay show={showOverlay} />
            <ApproveTransactionHeader
              title="Sign Transaction"
              href="https://leather.io/guides/connect-dapps"
              onPressRequestedByLink={e => {
                e.preventDefault();
                onClickRequestedByLink();
              }}
            />
            <FeeEditor.Trigger
              isLoading={isLoadingFees}
              marketData={marketData}
              onEditFee={onUserActivatesFeeEditor}
              selectedFee={selectedFee}
            />
            <NonceEditor.Trigger nonce={nonce} onEditNonce={onUserActivatesNonceEditor} />
          </Box>
          <Approver.Actions
            actions={getApproveTransactionActions({
              isBroadcasting,
              isSubmitted,
              isInsufficientBalance,
              isLoading: isLoadingData,
              onApprove: () =>
                broadcastTransaction(rpcRequest.unsignedTx, { fee: selectedFee.feeValue, nonce }),
              onCancel: () => closeWindow(),
            })}
          >
            <ApproveTransactionActionsTitle
              amount={
                selectedFee.feeValue !== null
                  ? i18nFormatCurrency(baseCurrencyAmountInQuote(selectedFee.feeValue, marketData))
                  : ''
              }
              isLoading={isLoadingData}
            />
            <ApproveTransactionError
              isLoading={isLoadingData}
              isInsufficientBalance={isInsufficientBalance}
            />
          </Approver.Actions>
        </Approver>
      </ApproveTransactionWrapper>
      <Outlet />
    </>
  );
}

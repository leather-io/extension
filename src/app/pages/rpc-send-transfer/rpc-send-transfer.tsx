import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency, sumMoney } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { ApproveBitcoinTransactionSwitchAccount } from '@app/components/approve-transaction/approve-bitcoin-transaction-switch-account';
import { ApproveTransactionError } from '@app/components/approve-transaction/approve-transaction-error';
import { ApproveTransactionHeader } from '@app/components/approve-transaction/approve-transaction-header';
import { ApproveTransactionRecipients } from '@app/components/approve-transaction/approve-transaction-recipients';
import { ApproveTransactionActionsTitle } from '@app/components/approve-transaction/approve-transaction-title';
import { ApproveTransactionWrapper } from '@app/components/approve-transaction/approve-transaction-wrapper';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

import { useRpcSendTransferContext } from './rpc-send-transfer.context';
import { useRpcSendTransferActions } from './use-rpc-send-transfer-actions';

export function RpcSendTransfer() {
  const { availableBalance, isLoadingFees, marketData, selectedFee } = useFeeEditorContext();
  const {
    recipients,
    recipientAddresses,
    amount,
    origin,
    isLoading,
    tabId,
    onUserActivatesFeeEditor,
    onUserActivatesSwitchAccount,
  } = useRpcSendTransferContext();

  useBreakOnNonCompliantEntity(recipientAddresses);

  const isInsufficientBalance = availableBalance.amount.isLessThan(amount.amount);
  const { approverActions, isBroadcasting, isSubmitted } = useRpcSendTransferActions();
  const showOverlay = isBroadcasting || isSubmitted;

  const totalFiatValue = useMemo(() => {
    const fee = selectedFee?.feeValue;
    if (!fee) return '';
    return i18nFormatCurrency(baseCurrencyAmountInQuote(sumMoney([amount, fee]), marketData));
  }, [amount, marketData, selectedFee?.feeValue]);

  return (
    <>
      <ApproveTransactionWrapper showOverlay={showOverlay}>
        <Approver requester={origin} width="100%">
          <Box position="relative">
            <BackgroundOverlay show={showOverlay} />
            <ApproveTransactionHeader
              title="Send Bitcoin"
              href="https://leather.io/guides/connect-dapps"
              onPressRequestedByLink={e => {
                e.preventDefault();
                void analytics.track('user_clicked_requested_by_link', {
                  endpoint: 'sendTransfer',
                });
                focusTabAndWindow(tabId);
              }}
            />
            <ApproveBitcoinTransactionSwitchAccount
              toggleSwitchAccount={onUserActivatesSwitchAccount}
            />
            <ApproveTransactionRecipients recipients={recipients} />
            <FeeEditor.Trigger
              isLoading={isLoadingFees}
              marketData={marketData}
              onEditFee={onUserActivatesFeeEditor}
              selectedFee={selectedFee}
            />
          </Box>
          <Approver.Actions actions={approverActions}>
            <ApproveTransactionActionsTitle amount={totalFiatValue} isLoading={isLoading} />
            <ApproveTransactionError
              isLoading={isLoading}
              isInsufficientBalance={isInsufficientBalance}
            />
          </Approver.Actions>
        </Approver>
      </ApproveTransactionWrapper>
      <Outlet />
    </>
  );
}

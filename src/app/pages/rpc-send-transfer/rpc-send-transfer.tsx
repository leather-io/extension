import { useMemo } from 'react';

import { Box } from 'leather-styles/jsx';

import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency, sumMoney } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { TransactionActionsTitle } from '@app/components/rpc-transaction-request/transaction-actions-title';
import { TransactionError } from '@app/components/rpc-transaction-request/transaction-error';
import { TransactionHeader } from '@app/components/rpc-transaction-request/transaction-header';
import { TransactionRecipients } from '@app/components/rpc-transaction-request/transaction-recipients';
import { TransactionSwitchAccount } from '@app/components/rpc-transaction-request/transaction-switch-account';
import { TransactionWrapper } from '@app/components/rpc-transaction-request/transaction-wrapper';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

import { useRpcSendTransferContext } from './rpc-send-transfer.context';
import { useRpcSendTransferActions } from './use-rpc-send-transfer-actions';

export function RpcSendTransfer() {
  const { availableBalance, isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const {
    recipients,
    recipientAddresses,
    amount,
    origin,
    isLoadingBalance,
    tabId,
    onUserActivatesSwitchAccount,
  } = useRpcSendTransferContext();

  useBreakOnNonCompliantEntity(recipientAddresses);

  const isInsufficientBalance = availableBalance.amount.isLessThan(amount.amount);
  const { approverActions, isBroadcasting, isSubmitted } = useRpcSendTransferActions();
  const showOverlay = isBroadcasting || isSubmitted;

  const totalFiatValue = useMemo(() => {
    const fee = selectedFee?.txFee;
    if (!fee) return '';
    return i18nFormatCurrency(baseCurrencyAmountInQuote(sumMoney([amount, fee]), marketData));
  }, [amount, marketData, selectedFee?.txFee]);

  return (
    <TransactionWrapper showOverlay={showOverlay}>
      <Approver requester={origin} width="100%">
        <Box position="relative">
          <BackgroundOverlay show={showOverlay} />
          <TransactionHeader
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
          <TransactionSwitchAccount toggleSwitchAccount={onUserActivatesSwitchAccount} />
          <TransactionRecipients recipients={recipients} />
          <FeeEditor.Trigger
            feeType="fee-rate"
            isLoading={isLoadingFees}
            marketData={marketData}
            onEditFee={onUserActivatesFeeEditor}
            selectedFee={selectedFee}
          />
        </Box>
        <Approver.Actions actions={approverActions}>
          <TransactionActionsTitle amount={totalFiatValue} isLoading={isLoadingBalance} />
          <TransactionError
            isLoading={isLoadingBalance}
            isInsufficientBalance={isInsufficientBalance}
          />
        </Approver.Actions>
      </Approver>
    </TransactionWrapper>
  );
}

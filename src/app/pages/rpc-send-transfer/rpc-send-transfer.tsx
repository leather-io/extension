import { useMemo } from 'react';

import { Box } from 'leather-styles/jsx';

import { Approver, BtcAvatarIcon } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, sumMoney } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { formatCurrency } from '@app/common/currency-formatter';
import { focusTabAndWindow } from '@app/common/focus-tab';
import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { AccountBitcoinAddress } from '@app/components/account/account-bitcoin-address';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { TransactionActionsTitle } from '@app/components/rpc-transaction-request/transaction-actions-title';
import { TransactionError } from '@app/components/rpc-transaction-request/transaction-error';
import { TransactionHeader } from '@app/components/rpc-transaction-request/transaction-header';
import { TransactionRecipientsLayout } from '@app/components/rpc-transaction-request/transaction-recipients.layout';
import { TransactionWrapper } from '@app/components/rpc-transaction-request/transaction-wrapper';
import { FeeEditor } from '@app/features/fee-editor/fee-editor';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { SigningAccountCard } from '@app/features/rpc-stacks-transaction-request/signing-account-card/signing-account-card';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentAccountIndex } from '@app/store/accounts/account';

import { useRpcSendTransferContext } from './rpc-send-transfer.context';
import { useRpcSendTransferActions } from './use-rpc-send-transfer-actions';

export function RpcSendTransfer() {
  const index = useCurrentAccountIndex();
  const { availableBalance, isLoadingFees, marketData, onUserActivatesFeeEditor, selectedFee } =
    useFeeEditorContext();
  const { recipients, recipientAddresses, amount, origin, isLoadingBalance, tabId } =
    useRpcSendTransferContext();

  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('BTC');

  useBreakOnNonCompliantEntity(recipientAddresses);

  const isInsufficientBalance = availableBalance.amount.isLessThan(amount.amount);
  const { approverActions, isBroadcasting, isSubmitted } = useRpcSendTransferActions();
  const showOverlay = isBroadcasting || isSubmitted;

  const totalFiatValue = useMemo(() => {
    const fee = selectedFee?.txFee;
    if (!fee) return '';
    return formatCurrency(baseCurrencyAmountInQuote(sumMoney([amount, fee]), marketData));
  }, [amount, marketData, selectedFee?.txFee]);

  return (
    <TransactionWrapper showOverlay={showOverlay}>
      <Approver requester={origin} width="100%">
        <Box position="relative">
          <BackgroundOverlay show={showOverlay} />
          <TransactionHeader
            title="Send token"
            href="https://leather.io/guides/connect-dapps"
            onPressRequestedByLink={e => {
              e.preventDefault();
              void analytics.track('user_clicked_requested_by_link', {
                endpoint: 'sendTransfer',
              });
              focusTabAndWindow(tabId);
            }}
          />
          <SigningAccountCard
            address={<AccountBitcoinAddress index={index} />}
            availableBalance={availableBalance}
            fiatBalance={convertToFiatAmount(availableBalance)}
            isLoadingBalance={isLoadingBalance}
          />
          <TransactionRecipientsLayout
            title="Bitcoin"
            caption="Bitcoin blockchain"
            avatar={<BtcAvatarIcon />}
            convertToFiatAmount={convertToFiatAmount}
            recipients={recipients}
          />
          <FeeEditor.Trigger
            feeType="fee-rate"
            isLoading={isLoadingFees}
            isSponsored={false}
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

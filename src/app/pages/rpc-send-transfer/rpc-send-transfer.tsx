import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { Box } from 'leather-styles/jsx';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { Approver } from '@leather.io/ui';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  i18nFormatCurrency,
  sumMoney,
} from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { focusTabAndWindow } from '@app/common/focus-tab';
import { ApproveBitcoinTransactionSwitchAccount } from '@app/components/approve-transaction/approve-bitcoin-transaction-switch-account';
import { ApproveTransactionError } from '@app/components/approve-transaction/approve-transaction-error';
import { ApproveTransactionHeader } from '@app/components/approve-transaction/approve-transaction-header';
import { ApproveTransactionRecipients } from '@app/components/approve-transaction/approve-transaction-recipients';
import { ApproveTransactionSelectedFee } from '@app/components/approve-transaction/approve-transaction-selected-fee';
import { ApproveTransactionActionsTitle } from '@app/components/approve-transaction/approve-transaction-title';
import { BackgroundOverlay } from '@app/components/loading-overlay';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

import { RpcSendTransferWrapper } from './components/send-transfer-wrapper';
import { useRpcSendTransferState } from './rpc-send-transfer-container';
import { useSendTransferApproveActions } from './use-send-transfer-approve-actions';

export function RpcSendTransfer() {
  const {
    selectedFeeData,
    recipients,
    recipientsAddresses,
    totalAmount,
    onChooseTransferFee,
    origin,
    isLoadingFees,
    utxos,
    tabId,
    requestId,
    toggleSwitchAccount,
  } = useRpcSendTransferState();

  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');

  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  useBreakOnNonCompliantEntity(recipientsAddresses);

  const isInsufficientBalance = btcBalance.balance.availableBalance.amount.isLessThan(
    amountAsMoney.amount
  );

  const isLoading = btcBalance.isLoadingAllData;

  const { approverActions, isBroadcasting, isSubmitted } = useSendTransferApproveActions({
    amountAsMoney,
    recipients,
    utxos,
    selectedFeeData,
    requestId,
    tabId,
  });

  const showOverlay = isBroadcasting || isSubmitted;

  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  const totalFiatValue = useMemo(() => {
    const fee = selectedFeeData?.baseUnitsValue;
    const feeAsMoney = createMoney(fee, 'BTC');

    return i18nFormatCurrency(
      baseCurrencyAmountInQuote(sumMoney([amountAsMoney, feeAsMoney]), btcMarketData)
    );
  }, [amountAsMoney, selectedFeeData, btcMarketData]);

  return (
    <>
      <RpcSendTransferWrapper showOverlay={showOverlay}>
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

            <ApproveBitcoinTransactionSwitchAccount toggleSwitchAccount={toggleSwitchAccount} />

            <ApproveTransactionRecipients recipients={recipients} />

            <ApproveTransactionSelectedFee
              isLoading={isLoadingFees}
              selectedFeeData={selectedFeeData}
              onChooseTransferFee={onChooseTransferFee}
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
      </RpcSendTransferWrapper>
      <Outlet />
    </>
  );
}

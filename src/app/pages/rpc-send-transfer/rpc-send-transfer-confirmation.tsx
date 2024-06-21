import { useLocation, useNavigate } from 'react-router-dom';

import { HStack, Stack, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@leather.io/bitcoin';
import type { CryptoCurrencies } from '@leather.io/models';
import {
  useBitcoinBroadcastTransaction,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import { Button } from '@leather.io/ui';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  formatMoney,
  formatMoneyPadded,
  formatMoneyWithoutSymbol,
  i18nFormatCurrency,
  sumMoney,
  truncateMiddle,
} from '@leather.io/utils';

import { logger } from '@shared/logger';
import type { TransferRecipient } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { analytics } from '@shared/utils/analytics';

import { InfoCardFooter } from '@app/components/info-card/info-card';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { SendTransferConfirmationDetails } from './components/send-transfer-confirmation-details';
import { useRpcSendTransferRequestParams } from './use-rpc-send-transfer';

const symbol: CryptoCurrencies = 'BTC';

function useRpcSendTransferConfirmationState() {
  const location = useLocation();
  return {
    fee: get(location.state, 'fee') as string,
    recipients: get(location.state, 'recipients') as TransferRecipient[],
    time: get(location.state, 'time') as string,
    tx: get(location.state, 'tx') as string,
    feeRowValue: get(location.state, 'feeRowValue') as string,
  };
}

export function RpcSendTransferConfirmation() {
  const navigate = useNavigate();
  const { origin, requestId, tabId } = useRpcSendTransferRequestParams();
  const { fee, recipients, time, tx, feeRowValue } = useRpcSendTransferConfirmationState();
  const bitcoinAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  const psbt = decodeBitcoinTx(tx);
  const transferAmount = sumMoney(recipients.map(r => r.amount));
  const txFiatValue = i18nFormatCurrency(baseCurrencyAmountInQuote(transferAmount, btcMarketData));
  const txFiatValueSymbol = btcMarketData.price.symbol;
  const feeMoney = createMoney(Number(fee), symbol);
  const summaryFee = formatMoneyPadded(feeMoney);
  const totalSpend = sumMoney([transferAmount, feeMoney]);

  function formBtcTxSummaryState(txId: string) {
    return {
      txLink: {
        blockchain: 'bitcoin',
        txid: txId || '',
      },
      txId,
      recipients,
      fee: summaryFee,
      txValue: formatMoneyWithoutSymbol(transferAmount),
      arrivesIn: time,
      totalSpend: formatMoney(totalSpend),
      symbol,
      sendingValue: formatMoney(transferAmount),
      txFiatValue,
      txFiatValueSymbol,
      feeRowValue,
    };
  }

  async function onUserApproveSendTransferRequest() {
    if (!tabId || !origin) {
      logger.error('Cannot send transfer: missing tabId, origin');
      return;
    }
    void analytics.track('user_approved_send_transfer', { origin });

    await broadcastTx({
      tx,
      async onSuccess(txid) {
        void analytics.track('broadcast_transaction', {
          symbol: 'btc',
          amount: transferAmount,
          fee,
          inputs: psbt.inputs.length,
          outputs: psbt.inputs.length,
        });
        await refetch();

        chrome.tabs.sendMessage(
          tabId,
          makeRpcSuccessResponse('sendTransfer', {
            id: requestId,
            result: { txid },
          })
        );

        navigate(RouteUrls.RpcSendTransferSummary, {
          state: formBtcTxSummaryState(txid),
        });
      },
      onError(e) {
        logger.error('Error broadcasting tx', e);
      },
    });
  }

  return (
    <>
      <Stack width="100%" gap={4} height="100%" pb="100px">
        {recipients.map((recipient, index) => (
          <SendTransferConfirmationDetails
            key={index}
            currentAddress={truncateMiddle(bitcoinAddress)}
            recipient={truncateMiddle(recipient.address)}
            amount={recipient.amount}
          />
        ))}
        <Stack border="active" borderRadius="sm" p="space.05" gap="space.04" width="100%">
          <HStack alignItems="center" gap="space.04" justifyContent="space-between">
            <styled.span color="ink.text-subdued">Fee</styled.span>
            <styled.span>{feeRowValue}</styled.span>
          </HStack>
          <HStack alignItems="center" gap="space.04" justifyContent="space-between">
            <styled.span color="ink.text-subdued">Total amount</styled.span>
            <styled.span>{formatMoney(totalSpend)}</styled.span>
          </HStack>
          {time && (
            <HStack alignItems="center" gap="space.04" justifyContent="space-between">
              <styled.span color="ink.text-subdued">Estimated time</styled.span>
              <styled.span>{time}</styled.span>
            </HStack>
          )}
        </Stack>
      </Stack>

      <InfoCardFooter>
        <Button
          borderRadius="sm"
          flexGrow={1}
          aria-busy={isBroadcasting}
          onClick={onUserApproveSendTransferRequest}
        >
          Send
        </Button>
      </InfoCardFooter>
    </>
  );
}

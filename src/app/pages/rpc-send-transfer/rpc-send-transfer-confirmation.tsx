import { useLocation, useNavigate } from 'react-router-dom';

import type { CryptoCurrencies } from '@leather-wallet/models';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { createMoney, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import type { RpcSendTransferRecipient } from '@shared/rpc/methods/send-transfer';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoney, formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { InfoCardFooter } from '@app/components/info-card/info-card';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Button } from '@app/ui/components/button/button';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { SendTransferConfirmationDetails } from './components/send-transfer-confirmation-details';
import { useRpcSendTransferRequestParams } from './use-rpc-send-transfer';

const symbol: CryptoCurrencies = 'BTC';

function useRpcSendTransferConfirmationState() {
  const location = useLocation();
  return {
    fee: get(location.state, 'fee') as string,
    recipients: get(location.state, 'recipients') as RpcSendTransferRecipient[],
    time: get(location.state, 'time') as string,
    tx: get(location.state, 'tx') as string,
    feeRowValue: get(location.state, 'feeRowValue') as string,
  };
}

export function RpcSendTransferConfirmation() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { origin, requestId, tabId } = useRpcSendTransferRequestParams();
  const { fee, recipients, time, tx, feeRowValue } = useRpcSendTransferConfirmationState();
  const bitcoinAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  const psbt = decodeBitcoinTx(tx);
  const transferAmount = satToBtc(psbt.outputs[0].amount.toString()).toString();
  const txFiatValue = i18nFormatCurrency(
    baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(transferAmount), symbol), btcMarketData)
  );
  const txFiatValueSymbol = btcMarketData.price.symbol;
  const feeInBtc = satToBtc(fee);
  const summaryFee = formatMoneyPadded(createMoney(Number(fee), symbol));
  const sendingValue = formatMoney(createMoneyFromDecimal(Number(transferAmount), symbol));
  const totalSpend = formatMoney(
    createMoneyFromDecimal(Number(transferAmount) + Number(feeInBtc), symbol)
  );

  function formBtcTxSummaryState(txId: string) {
    return {
      txLink: {
        blockchain: 'bitcoin',
        txid: txId || '',
      },
      txId,
      recipients,
      fee: summaryFee,
      txValue: transferAmount,
      arrivesIn: time,
      totalSpend,
      symbol,
      sendingValue,
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
      <Stack gap={4} width="100%">
        {recipients.map((recipient, index) => (
          <SendTransferConfirmationDetails
            key={index}
            currentAddress={truncateMiddle(bitcoinAddress)}
            recipient={truncateMiddle(recipient.address)}
            time={time}
            total={totalSpend}
            feeRowValue={feeRowValue}
          />
        ))}
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

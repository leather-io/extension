import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { createMoney, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { Header } from '@app/components/header';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { SendFormConfirmationLayout } from '../../components/confirmation/components/send-form-confirmation.layout';
import { useBitcoinBroadcastTransaction } from '../../family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { BtcSendFormConfirmationDetails } from './btc-send-form-confirmation-details';

export function BtcSendFormConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = get(location.state, 'tx');
  const recipient = get(location.state, 'recipient');
  const fee = get(location.state, 'fee');
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useCurrentNativeSegwitUtxos();
  const analytics = useAnalytics();
  const { psbt, broadcastTransaction } = useBitcoinBroadcastTransaction(tx);
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  const nav = useSendFormNavigate();

  const transferAmount = satToBtc(psbt.outputs[0].amount.toString()).toString();
  const feeInBtc = satToBtc(fee);
  const { data: feeRate } = useBitcoinFeeRate();

  async function confirmTransaction() {
    try {
      setIsLoading(true);
      const txId = await broadcastTransaction();

      void analytics.track('broadcast_transaction', {
        token: 'btc',
        amount: transferAmount,
        fee,
        inputs: psbt.inputs.length,
        outputs: psbt.inputs.length,
      });
      await refetch();

      navigate(RouteUrls.SentBtcTxSummary.replace(':txId', `${txId}`), {
        state: formBtcTxSummaryState(txId),
      });
    } catch (e) {
      nav.toErrorPage(e);
    } finally {
      setIsLoading(false);
    }
  }

  function formBtcTxSummaryState(txId: string) {
    const symbol = 'BTC';
    const arrivesIn = feeRate ? `~${feeRate?.fastestFee} min` : '~10 – 20 min';
    return {
      txLink: {
        blockchain: 'bitcoin',
        txid: txId || '',
      },
      txId,
      recipient,
      fee: formatMoney(createMoney(Number(fee), symbol)),
      txValue: transferAmount,
      arrivesIn,
      totalSpend: formatMoney(
        createMoneyFromDecimal(Number(transferAmount) + Number(feeInBtc), symbol)
      ),
      symbol,
      sendingValue: formatMoney(createMoneyFromDecimal(Number(transferAmount), symbol)),
      txFiatValue: i18nFormatCurrency(
        baseCurrencyAmountInQuote(
          createMoneyFromDecimal(Number(transferAmount), symbol),
          btcMarketData
        )
      ),
    };
  }
  useRouteHeader(
    <Header
      hideActions
      onClose={() =>
        nav.backToSendForm({
          recipient,
          amount: transferAmount,
        })
      }
      title="Confirm transaction"
    />
  );

  return (
    <SendFormConfirmationLayout>
      <BtcSendFormConfirmationDetails
        unsignedTx={psbt}
        recipient={recipient}
        fee={createMoney(fee, 'BTC')}
      />
      <ConfirmationButton isLoading={isLoading} onClick={confirmTransaction} />
    </SendFormConfirmationLayout>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@shared/crypto/bitcoin/bitcoin.utils';
import { createMoney, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

const symbol = 'BTC';

export function BtcSendFormConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = get(location.state, 'tx');
  const recipient = get(location.state, 'recipient');
  const fee = get(location.state, 'fee');

  const { refetch } = useCurrentNativeSegwitUtxos();
  const analytics = useAnalytics();

  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const psbt = decodeBitcoinTx(tx);

  const nav = useSendFormNavigate();

  const transferAmount = satToBtc(psbt.outputs[0].amount.toString()).toString();
  const txFiatValue = i18nFormatCurrency(
    baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(transferAmount), symbol), btcMarketData)
  );
  const txFiatValueSymbol = btcMarketData.price.symbol;
  const { data: feeRate } = useBitcoinFeeRate();
  const arrivesIn = feeRate ? `~${feeRate.fastestFee} min` : '~10 – 20 min';

  const feeInBtc = satToBtc(fee);
  const totalSpend = formatMoney(
    createMoneyFromDecimal(Number(transferAmount) + Number(feeInBtc), symbol)
  );
  const sendingValue = formatMoney(createMoneyFromDecimal(Number(transferAmount), symbol));
  const summaryFee = formatMoney(createMoney(Number(fee), symbol));

  async function initiateTransaction() {
    await broadcastTx({
      tx,
      async onSuccess(txid) {
        void analytics.track('broadcast_transaction', {
          token: 'btc',
          amount: transferAmount,
          fee,
          inputs: psbt.inputs.length,
          outputs: psbt.inputs.length,
        });
        await refetch();
        navigate(RouteUrls.SentBtcTxSummary.replace(':txId', `${txid}`), {
          state: formBtcTxSummaryState(txid),
        });
      },
      onError(e) {
        nav.toErrorPage(e);
      },
    });
  }

  function formBtcTxSummaryState(txId: string) {
    return {
      hasHeaderTitle: true,
      txLink: {
        blockchain: 'bitcoin',
        txid: txId || '',
      },
      txId,
      recipient,
      fee: summaryFee,
      txValue: transferAmount,
      arrivesIn,
      totalSpend,
      symbol,
      sendingValue,
      txFiatValue,
      txFiatValueSymbol,
    };
  }

  useRouteHeader(<ModalHeader hideActions defaultClose defaultGoBack title="Review" />);

  return (
    <InfoCard padding="extra-loose" data-testid={SendCryptoAssetSelectors.ConfirmationDetails}>
      <InfoCardAssetValue
        value={Number(transferAmount)}
        fiatValue={txFiatValue}
        fiatSymbol={txFiatValueSymbol}
        symbol={symbol}
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
      />

      <Stack width="100%" mb="36px">
        <InfoCardRow
          title="To"
          value={<FormAddressDisplayer address={recipient} />}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsRecipient}
        />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />
        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow
          title="Fee"
          value={summaryFee}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
        />
        <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
      </Stack>

      <PrimaryButton isLoading={isBroadcasting} width="100%" onClick={initiateTransaction}>
        Confirm and send transaction
      </PrimaryButton>
    </InfoCard>
  );
}

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  useBitcoinBroadcastTransaction,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather-wallet/query';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  createMoneyFromDecimal,
  formatMoneyPadded,
  i18nFormatCurrency,
  satToBtc,
} from '@leather-wallet/utils';
import { hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@shared/crypto/bitcoin/bitcoin.utils';
import { CryptoCurrencies } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { queryClient } from '@app/common/persistence';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

const symbol: CryptoCurrencies = 'BTC';

function useBtcSendFormConfirmationState() {
  const location = useLocation();
  return {
    tx: get(location.state, 'tx') as string,
    fee: get(location.state, 'fee') as number,
    feeRowValue: get(location.state, 'feeRowValue') as string,
    arrivesIn: get(location.state, 'time') as string,
    recipient: get(location.state, 'recipient') as string,
  };
}

export function BtcSendFormConfirmation() {
  const navigate = useNavigate();
  const { tx, recipient, fee, arrivesIn, feeRowValue } = useBtcSendFormConfirmationState();

  const transaction = useMemo(() => btc.Transaction.fromRaw(hexToBytes(tx)), [tx]);
  // const inputs = useMemo(() => getPsbtTxInputs(transaction), [transaction]);

  // const inputTransactions = useGetBitcoinTransactionQueries(
  //   inputs
  //     .map(input => input.txid)
  //     .filter(isDefined)
  //     .map(txid => bytesToHex(txid))
  // );

  const { refetch } = useCurrentNativeSegwitUtxos();
  const analytics = useAnalytics();

  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();

  // console.log({ transaction });

  // useMemo(() => {
  //   if (inputTransactions.some(query => !query.data)) return null;

  //   const inputTotal = sumNumbers(
  //     inputs
  //       .map((input, index) => inputTransactions[index].data?.vout[input.index ?? 0].value)
  //       .filter(isDefined)
  //   );

  //   const outputs = getPsbtTxOutputs(transaction);

  //   const outputTotal = sumNumbers(
  //     outputs
  //       .map(output => output.amount)
  //       .filter(isDefined)
  //       .map(val => Number(val))
  //   );

  //   // console.log('Presented fee', fee);
  //   // console.log('fee === ', inputTotal.minus(outputTotal).toNumber());

  //   console.log('Actual vsize ', transaction.vsize);
  //   console.log('Fee ', fee);
  //   console.log('Fee row value', feeRowValue);
  //   console.log('Sats per vbytes ', new BigNumber(fee).dividedBy(transaction.vsize).toNumber());
  // }, [fee, feeRowValue, inputTransactions, inputs, transaction]);

  // console.log({ inputs, outputs });

  const decodedTx = decodeBitcoinTx(transaction.hex);

  const nav = useSendFormNavigate();

  const transferAmount = satToBtc(decodedTx.outputs[0].amount.toString()).toString();
  const txFiatValue = i18nFormatCurrency(
    baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(transferAmount), symbol), btcMarketData)
  );
  const txFiatValueSymbol = btcMarketData.price.symbol;

  const feeInBtc = satToBtc(fee);
  const totalSpend = formatMoneyPadded(
    createMoneyFromDecimal(Number(transferAmount) + Number(feeInBtc), symbol)
  );
  const sendingValue = formatMoneyPadded(createMoneyFromDecimal(Number(transferAmount), symbol));
  const summaryFee = formatMoneyPadded(createMoney(Number(fee), symbol));

  async function initiateTransaction() {
    await broadcastTx({
      tx: transaction.hex,
      async onSuccess(txid) {
        void analytics.track('broadcast_transaction', {
          symbol: 'btc',
          amount: transferAmount,
          fee,
          inputs: decodedTx.inputs.length,
          outputs: decodedTx.inputs.length,
        });
        await refetch();
        navigate(RouteUrls.SentBtcTxSummary.replace(':txId', `${txid}`), {
          state: formBtcTxSummaryState(txid),
        });

        // invalidate txs query after some time to ensure that the new tx will be shown in the list
        setTimeout(
          () => void queryClient.invalidateQueries({ queryKey: ['btc-txs-by-address'] }),
          2000
        );
      },
      onError(e) {
        void analytics.track('broadcast_btc_error', {
          error: e,
        });
        nav.toErrorPage(e);
      },
    });
  }

  function formBtcTxSummaryState(txId: string) {
    return {
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
      feeRowValue,
    };
  }

  return (
    <Card
      dataTestId={SendCryptoAssetSelectors.ConfirmationDetails}
      footer={
        <Footer variant="card">
          <Button
            data-testid={SharedComponentsSelectors.InfoCardButton}
            aria-busy={isBroadcasting}
            onClick={initiateTransaction}
            width="100%"
          >
            Confirm and send transaction
          </Button>
        </Footer>
      }
    >
      <CardContent p="space.00">
        <InfoCardAssetValue
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          mb="space.06"
          mt="space.05"
          px="space.05"
          symbol={symbol}
          value={Number(transferAmount)}
        />

        <Stack pb="space.06" px="space.06" width="100%">
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
            value={feeRowValue}
            data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
          />
          {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
        </Stack>
      </CardContent>
    </Card>
  );
}

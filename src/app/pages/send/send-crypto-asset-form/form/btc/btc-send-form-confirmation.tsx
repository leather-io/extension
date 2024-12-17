import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@leather.io/bitcoin';
import type { CryptoCurrency } from '@leather.io/models';
import {
  useBitcoinBroadcastTransaction,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import { Button } from '@leather.io/ui';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  createMoneyFromDecimal,
  formatMoneyPadded,
  i18nFormatCurrency,
  satToBtc,
} from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { queryClient } from '@app/common/persistence';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Card, Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

const symbol: CryptoCurrency = 'BTC';

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

  const { filteredUtxosQuery } = useCurrentNativeSegwitUtxos();

  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();

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

  const utxosOfSpendableInscriptions = useInscribedSpendableUtxos();

  async function initiateTransaction() {
    await broadcastTx({
      skipSpendableCheckUtxoIds: utxosOfSpendableInscriptions.map(utxo => utxo.txid),
      tx: transaction.hex,
      async onSuccess(txid) {
        void analytics.track('broadcast_transaction', {
          symbol: 'btc',
          amount: Number(transferAmount),
          fee,
          inputs: decodedTx.inputs.length,
          outputs: decodedTx.inputs.length,
        });
        await filteredUtxosQuery.refetch();
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
    <>
      <PageHeader title="Review" />
      <Content>
        <Page>
          <Card
            contentStyle={{
              p: 'space.00',
            }}
            dataTestId={SendCryptoAssetSelectors.ConfirmationDetails}
            footer={
              <Button
                data-testid={SharedComponentsSelectors.InfoCardButton}
                aria-busy={isBroadcasting}
                onClick={initiateTransaction}
                width="100%"
              >
                Confirm and send transaction
              </Button>
            }
          >
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
          </Card>
        </Page>
      </Content>
    </>
  );
}

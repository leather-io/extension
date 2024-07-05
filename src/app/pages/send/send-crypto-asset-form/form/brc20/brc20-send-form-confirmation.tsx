import { useLocation, useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@leather.io/bitcoin';
import { useBitcoinBroadcastTransaction } from '@leather.io/query';
import { Button } from '@leather.io/ui';
import { createMoney, formatMoney, formatMoneyPadded, sumMoney } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Footer } from '@app/features/container/containers/footers/footer';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBrc20Transfers } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

function useBrc20SendFormConfirmationState() {
  const location = useLocation();
  return {
    orderId: get(location.state, 'orderId') as string,
    fee: get(location.state, 'fee') as string,
    feeRowValue: get(location.state, 'feeRowValue') as string,
    serviceFee: get(location.state, 'serviceFee') as number,
    serviceFeeRecipient: get(location.state, 'serviceFeeRecipient') as string,
    recipient: get(location.state, 'recipient') as string,
    ticker: get(location.state, 'ticker') as string,
    amount: get(location.state, 'amount') as string,
    tx: get(location.state, 'tx') as string,
    holderAddress: get(location.state, 'holderAddress') as string,
  };
}

export function Brc20SendFormConfirmation() {
  const navigate = useNavigate();

  const { amount, recipient, fee, ticker, serviceFee, tx, orderId, feeRowValue, holderAddress } =
    useBrc20SendFormConfirmationState();

  const summaryFeeMoney = createMoney(Number(fee), 'BTC');

  const serviceFeeMoney = createMoney(serviceFee, 'BTC');
  const serviceFeeFormatted = formatMoneyPadded(serviceFeeMoney);

  const totalFee = sumMoney([summaryFeeMoney, serviceFeeMoney]);
  const totalFeeFormatted = formatMoney(totalFee);

  const amountFormatted = formatMoney(createMoney(Number(amount), ticker, 0));
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { refetch } = useCurrentNativeSegwitUtxos();

  const psbt = decodeBitcoinTx(tx);
  const nav = useSendFormNavigate();

  const { inscriptionPaymentTransactionComplete } = useBrc20Transfers(holderAddress);

  async function initiateTransaction() {
    await broadcastTx({
      tx,
      async onSuccess(txId: string) {
        inscriptionPaymentTransactionComplete(orderId, Number(amount), recipient, ticker);

        void analytics.track('broadcast_transaction', {
          symbol: ticker,
          type: 'brc-20',
          amount,
          fee,
          inputs: psbt.inputs.length,
          outputs: psbt.inputs.length,
        });
        await refetch();
        navigate(RouteUrls.SentBrc20Summary.replace(':ticker', ticker), {
          state: {
            serviceFee: serviceFeeFormatted,
            totalFee: totalFeeFormatted,
            recipient,
            ticker,
            amount,
            txId,
            feeRowValue,
            txLink: {
              blockchain: 'bitcoin',
              txid: txId || '',
            },
          },
        });
      },
      onError(e) {
        void analytics.track('broadcast_brc20_error', {
          error: e,
        });

        nav.toErrorPage(e);
      },
    });
  }

  return (
    <Card
      dataTestId={SendCryptoAssetSelectors.ConfirmationDetails}
      footer={
        <Footer variant="card">
          <Button aria-busy={isBroadcasting} onClick={initiateTransaction} width="100%">
            Create transfer inscription
          </Button>
        </Footer>
      }
    >
      <CardContent p="space.00">
        <InfoCardAssetValue
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
          mb="space.06"
          mt="space.05"
          px="space.05"
          symbol={ticker}
          value={Number(amount)}
        />

        <Stack pb="space.06" px="space.06" width="100%">
          <InfoCardRow title="Sending" value={amountFormatted} />
          <InfoCardRow title="Inscription service fee" value={serviceFeeFormatted} />
          <InfoCardRow
            title="Payment transaction fee"
            value={feeRowValue}
            data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
          />
          <InfoCardSeparator />

          <InfoCardRow title="Total fee" value={totalFeeFormatted} />
        </Stack>
      </CardContent>
    </Card>
  );
}

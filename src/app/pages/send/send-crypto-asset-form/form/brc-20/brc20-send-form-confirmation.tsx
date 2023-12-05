import { useLocation, useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { decodeBitcoinTx } from '@shared/crypto/bitcoin/bitcoin.utils';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { sumMoney } from '@app/common/money/calculate-money';
import { formatMoney, formatMoneyPadded } from '@app/common/money/format-money';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBrc20Transfers } from '@app/query/bitcoin/ordinals/brc20/use-brc-20';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { Button } from '@app/ui/components/button/button';

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
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
    tx: get(location.state, 'tx') as string,
  };
}

export function Brc20SendFormConfirmation() {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const { amount, recipient, fee, tick, serviceFee, tx, orderId, feeRowValue } =
    useBrc20SendFormConfirmationState();

  const summaryFeeMoney = createMoney(Number(fee), 'BTC');

  const serviceFeeMoney = createMoney(serviceFee, 'BTC');
  const serviceFeeFormatted = formatMoneyPadded(serviceFeeMoney);

  const totalFee = sumMoney([summaryFeeMoney, serviceFeeMoney]);
  const totalFeeFormatted = formatMoney(totalFee);

  const amountFormatted = formatMoney(createMoney(Number(amount), tick, 0));
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { refetch } = useCurrentNativeSegwitUtxos();

  const psbt = decodeBitcoinTx(tx);
  const nav = useSendFormNavigate();
  const { inscriptionPaymentTransactionComplete } = useBrc20Transfers();

  async function initiateTransaction() {
    await broadcastTx({
      tx,
      async onSuccess(txId: string) {
        inscriptionPaymentTransactionComplete(orderId, Number(amount), recipient, tick);

        void analytics.track('broadcast_transaction', {
          symbol: tick,
          type: 'brc-20',
          amount,
          fee,
          inputs: psbt.inputs.length,
          outputs: psbt.inputs.length,
        });
        await refetch();
        navigate(RouteUrls.SentBrc20Summary.replace(':ticker', tick), {
          state: {
            serviceFee: serviceFeeFormatted,
            totalFee: totalFeeFormatted,
            recipient,
            tick,
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
        nav.toErrorPage(e);
      },
    });
  }

  return (
    <InfoCard data-testid={SendCryptoAssetSelectors.ConfirmationDetails}>
      <InfoCardAssetValue
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
        mb="space.06"
        mt="space.05"
        px="space.05"
        symbol={tick}
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

      <InfoCardFooter>
        <Button aria-busy={isBroadcasting} onClick={initiateTransaction} width="100%">
          Create transfer inscription
        </Button>
      </InfoCardFooter>
    </InfoCard>
  );
}

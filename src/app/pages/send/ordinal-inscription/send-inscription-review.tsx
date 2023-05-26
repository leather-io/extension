import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from '@stacks/ui';
import get from 'lodash.get';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { formatMoney } from '@app/common/money/format-money';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { InfoCard, InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { PrimaryButton } from '@app/components/primary-button';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/use-current-account-native-segwit-utxos';

import { InscriptionPreviewCard } from '../../../components/inscription-preview-card/inscription-preview-card';
import { useBitcoinBroadcastTransaction } from '../../../query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useSendInscriptionState } from './components/send-inscription-container';

function useSendInscriptionReviewState() {
  const location = useLocation();
  return {
    arrivesIn: get(location.state, 'time') as string,
    signedTx: get(location.state, 'tx') as string,
    recipient: get(location.state, 'recipient', '') as string,
    fee: get(location.state, 'fee') as number,
  };
}

export function SendInscriptionReview() {
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const { arrivesIn, signedTx, recipient, fee } = useSendInscriptionReviewState();

  const { inscription } = useSendInscriptionState();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();

  const summaryFee = formatMoney(createMoney(Number(fee), 'BTC'));

  async function sendInscription() {
    await broadcastTx({
      tx: signedTx,
      async onSuccess(txId: string) {
        void analytics.track('broadcast_ordinal_transaction');
        await refetch();

        navigate(RouteUrls.SendOrdinalInscriptionSent, {
          state: {
            inscription,
            recipient,
            arrivesIn,
            txId,
            summaryFee,
          },
        });
      },
      onError() {
        navigate(RouteUrls.SendOrdinalInscriptionError);
      },
    });
  }

  return (
    <BaseDrawer title="Review" isShowing enableGoBack onClose={() => navigate(RouteUrls.Home)}>
      <Box px="extra-loose" mt="extra-loose">
        <InscriptionPreviewCard
          image={<InscriptionPreview inscription={inscription} />}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      </Box>

      <InfoCard pt="extra-loose" pb="extra-loose" px="extra-loose">
        <Stack width="100%" mb="36px">
          <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
          <InfoCardSeparator />
          <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
          <InfoCardRow title="Fee" value={summaryFee} />
        </Stack>

        <PrimaryButton isLoading={isBroadcasting} width="100%" onClick={sendInscription}>
          Confirm and send transaction
        </PrimaryButton>
      </InfoCard>
    </BaseDrawer>
  );
}

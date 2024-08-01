import { useLocation, useNavigate } from 'react-router-dom';

import { bytesToHex } from '@noble/hashes/utils';
import { Box, Flex, Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import { useBitcoinBroadcastTransaction } from '@leather.io/query';
import { Button, Dialog } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { Card, Footer } from '@app/components/layout';
import { DialogHeader } from '@app/components/layout/dialog-header';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useAppDispatch } from '@app/store';
import { inscriptionSent } from '@app/store/ordinals/ordinals.slice';

import { InscriptionPreviewCard } from '../../../components/inscription-preview-card/inscription-preview-card';
import { useSendInscriptionState } from './components/send-inscription-container';

function useSendInscriptionReviewState() {
  const location = useLocation();
  return {
    arrivesIn: get(location.state, 'time') as string,
    signedTx: get(location.state, 'signedTx') as Uint8Array,
    recipient: get(location.state, 'recipient', '') as string,
    feeRowValue: get(location.state, 'feeRowValue') as string,
  };
}

export function SendInscriptionReview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { arrivesIn, signedTx, recipient, feeRowValue } = useSendInscriptionReviewState();

  const { inscription } = useSendInscriptionState();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();

  async function sendInscription() {
    await broadcastTx({
      skipSpendableCheckUtxoIds: [inscription.txid],
      tx: bytesToHex(signedTx),
      async onSuccess(txid: string) {
        void analytics.track('broadcast_ordinal_transaction');
        await refetch();
        // Might be a BRC-20 transfer, so we want to remove it from the pending
        dispatch(inscriptionSent({ inscriptionId: inscription.id }));
        navigate(`/${RouteUrls.SendOrdinalInscription}/${RouteUrls.SendOrdinalInscriptionSent}`, {
          state: {
            inscription,
            recipient,
            arrivesIn,
            txid,
            feeRowValue,
            backgroundLocation: { pathname: RouteUrls.Home },
          },
        });
      },
      onError(e) {
        void analytics.track('broadcast_ordinal_error', { error: e });
        navigate(`/${RouteUrls.SendOrdinalInscription}/${RouteUrls.SendOrdinalInscriptionError}`, {
          state: {
            error: e,
            backgroundLocation: { pathname: RouteUrls.Home },
          },
        });
      },
    });
  }

  return (
    <Dialog
      header={<DialogHeader title="Review" />}
      isShowing
      onGoBack={() => navigate(-1)}
      onClose={() => navigate(RouteUrls.Home)}
    >
      <Card
        footer={
          <Footer variant="card">
            <Button
              variant="solid"
              disabled={isBroadcasting}
              aria-busy={isBroadcasting}
              onClick={sendInscription}
            >
              Confirm and send transaction
            </Button>
          </Footer>
        }
      >
        <Box px="space.06" mt="space.06">
          <InscriptionPreviewCard
            image={<InscriptionPreview inscription={inscription} />}
            subtitle="Ordinal inscription"
            title={inscription.title}
          />
        </Box>

        <Flex
          alignItems="center"
          flexDirection="column"
          justifyItems="center"
          width="100%"
          pt="space.06"
          pb="space.06"
          px="space.06"
        >
          <Stack width="100%" mb="36px">
            <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
            <InfoCardSeparator />
            {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
            <InfoCardRow title="Fee" value={feeRowValue} />
          </Stack>
        </Flex>
      </Card>
    </Dialog>
  );
}

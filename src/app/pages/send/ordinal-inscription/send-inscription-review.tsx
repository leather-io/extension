import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { PrimaryButton } from '@app/components/primary-button';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/address.hooks';

import { useBitcoinBroadcastTransaction } from '../../../query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { ConfirmationDetail } from '../send-crypto-asset-form/components/confirmation/components/confirmation-detail';
import { CollectiblePreviewCard } from './components/collectible-preview-card';
import { useInscriptionSendState } from './send-inscription-container';

function useSendInscrptionReviewState() {
  const location = useLocation();
  return {
    signedTx: get(location.state, 'tx') as string,
    recipient: get(location.state, 'recipient', '') as string,
  };
}

export function SendInscriptionReview() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { setActiveTabBalances } = useHomeTabs();
  const { signedTx, recipient } = useSendInscrptionReviewState();
  const { inscription } = useInscriptionSendState();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const truncatedAddress = truncateMiddle(recipient, 4);

  async function sendInscription() {
    await broadcastTx({
      tx: signedTx,
      async onSuccess() {
        void analytics.track('broadcast_ordinal_transaction');
        await refetch();
        navigate(RouteUrls.Home);
        setActiveTabBalances();
      },
      onError() {
        navigate(RouteUrls.SendOrdinalInscriptionError);
      },
    });
  }

  return (
    <BaseDrawer title="Review" isShowing enableGoBack onClose={() => navigate(RouteUrls.Home)}>
      <Box px="extra-loose" mt="extra-loose">
        <CollectiblePreviewCard inscription={inscription} />

        <Box width="100%" mt="loose">
          <ConfirmationDetail detail="To" value={truncatedAddress} title={recipient} />
        </Box>
        <PrimaryButton
          isLoading={isBroadcasting}
          my="base-loose"
          mb="extra-loose"
          onClick={sendInscription}
          width="100%"
        >
          Confirm
        </PrimaryButton>
      </Box>
    </BaseDrawer>
  );
}

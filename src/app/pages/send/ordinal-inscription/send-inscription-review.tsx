import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { PrimaryButton } from '@app/components/primary-button';
import { useCurrentBitcoinAddress } from '@app/query/bitcoin/address/address.hooks';

import { ConfirmationDetail } from '../send-crypto-asset-form/components/confirmation/components/confirmation-detail';
import { useBitcoinBroadcastTransaction } from '../send-crypto-asset-form/family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
import { CollectiblePreviewCard } from './components/collectible-preview-card';
import { useInscriptionSendState } from './send-inscription-container';

function useSendInscrptionReviewState() {
  const location = useLocation();
  return {
    signedTx: get(location.state, 'tx'),
    recipient: get(location.state, 'recipient', ''),
  };
}

export function SendInscriptionReview() {
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { setActiveTabBalances } = useHomeTabs();
  const { signedTx, recipient } = useSendInscrptionReviewState();
  const { inscription } = useInscriptionSendState();
  const { refetch } = useCurrentBitcoinAddress();
  const { broadcastTransaction } = useBitcoinBroadcastTransaction(signedTx);

  const truncatedAddress = truncateMiddle(recipient, 4);

  return (
    <BaseDrawer title="Review" isShowing enableGoBack onClose={() => navigate(RouteUrls.Home)}>
      <Box px="extra-loose" mt="extra-loose">
        <CollectiblePreviewCard inscription={inscription} />

        <Box width="100%" mt="loose">
          <ConfirmationDetail detail="To" value={truncatedAddress} title={recipient} />
        </Box>
        <PrimaryButton
          isLoading={isLoading}
          my="base-loose"
          mb="extra-loose"
          onClick={async () => {
            try {
              setIsLoading(true);
              await broadcastTransaction();
              void analytics.track('broadcast_ordinal_transaction');
              await refetch();
              navigate(RouteUrls.Home);
              setActiveTabBalances();
            } catch (e) {
              navigate(RouteUrls.SendOrdinalInscriptionError);
            } finally {
              setIsLoading(false);
            }
          }}
          width="100%"
        >
          Confirm
        </PrimaryButton>
      </Box>
    </BaseDrawer>
  );
}

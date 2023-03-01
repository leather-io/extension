import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, Stack } from '@stacks/ui';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { PrimaryButton } from '@app/components/primary-button';
import { useCurrentBitcoinAddress } from '@app/query/bitcoin/address/address.hooks';

import { useBitcoinBroadcastTransaction } from '../send-crypto-asset-form/family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
// import { ConfirmationDetail } from '../send-crypto-asset-form/components/confirmation/components/confirmation-detail';
import { Image } from './components/image';
import { Metadata } from './components/metadata';
import { useInscriptionSendState } from './send-inscription-container';

function useSendInscrptionReviewState() {
  const location = useLocation();
  return {
    signedTx: get(location.state, 'tx'),
  };
}

export function SendInscriptionReview() {
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { setActiveTabActivity } = useHomeTabs();
  const { signedTx } = useSendInscrptionReviewState();
  const { inscription } = useInscriptionSendState();
  const { refetch } = useCurrentBitcoinAddress();
  const { broadcastTransaction } = useBitcoinBroadcastTransaction(signedTx);

  // const recipientTruncated = truncateMiddle(formik.values.recipient, 4);

  return (
    <>
      <BaseDrawer title="Review" isShowing onClose={() => navigate('../..')}>
        <Box px="extra-loose">
          <Stack pb="extra-loose" alignItems="center" spacing="loose" textAlign="center">
            <Box
              border="1px solid"
              borderColor="#DCDDE2"
              borderRadius="16px"
              flexDirection="column"
              mt="loose"
              width="100%"
            >
              <Flex p="base" columnGap="16px">
                <Image inscription={inscription} />
                <Metadata inscription={inscription} />
              </Flex>
            </Box>
            <Box width="100%">
              {/* <ConfirmationDetail detail="To" value={recipientTruncated} /> */}
            </Box>
            <PrimaryButton
              isLoading={isLoading}
              mb="base"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await broadcastTransaction();
                  void analytics.track('broadcast_ordinal_transaction');
                  await refetch();
                  navigate(RouteUrls.Home);
                  setActiveTabActivity();
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
          </Stack>
        </Box>
      </BaseDrawer>
    </>
  );
}

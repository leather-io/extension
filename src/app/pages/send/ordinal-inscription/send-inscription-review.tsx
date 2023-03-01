import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import { Box, Button, Flex, Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { Formik, useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { ConfirmationDetail } from '../send-crypto-asset-form/components/confirmation/components/confirmation-detail';
import { Image } from './components/image';
import { Metadata } from './components/metadata';
import { useInscriptionSendState } from './send-inscription-container';
import { useSendOrdinalInscriptionRouteState } from './use-send-ordinal-inscription-route-state';

export const recipeintFieldName = 'recipient';

export function useSendInscrptionReviewState() {
  const location = useLocation();
  return {
    signedTx: '',
  };
}

export function SendInscriptionReview() {
  const navigate = useNavigate();

  const { inscription } = useInscriptionSendState();

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
            <Button width="100%" onClick={() => navigate(RouteUrls.SendOrdinalInscriptionReview)}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </BaseDrawer>
    </>
  );
}

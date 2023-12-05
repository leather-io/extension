import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import { Box, Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { ErrorLabel } from '@app/components/error-label';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { InscriptionPreviewCard } from '@app/components/inscription-preview-card/inscription-preview-card';
import { OrdinalIcon } from '@app/ui/components/avatar-icon/ordinal-icon';
import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';

import { RecipientAddressTypeField } from '../send-crypto-asset-form/components/recipient-address-type-field';
import { CollectibleAsset } from './components/collectible-asset';
import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';
import { SendInscriptionFormLoader } from './send-indcription-form-loader';

export const recipeintFieldName = 'recipient';

export function SendInscriptionForm() {
  const navigate = useNavigate();
  const { feeRates, inscription, recipient } = useSendInscriptionState();
  const { chooseTransactionFee, currentError, validationSchema, isCheckingFees } =
    useSendInscriptionForm();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        [recipeintFieldName]: recipient,
        inscription,
        feeRate: feeRates.hourFee.toNumber(),
      }}
      onSubmit={chooseTransactionFee}
    >
      <Form>
        <Dialog
          title="Send"
          onGoBack={() => navigate(-1)}
          isShowing
          onClose={() => navigate(RouteUrls.Home)}
        >
          <SendInscriptionFormLoader isLoading={isCheckingFees}>
            <Box display="flex" flexDirection="column" px="space.06" pb="space.04">
              <InscriptionPreviewCard
                image={<InscriptionPreview inscription={inscription} />}
                subtitle="Ordinal inscription"
                title={inscription.title}
              />
              <Box mt={['space.04', 'space.06', '100px']}>
                <Flex flexDirection="column" mt="space.05" width="100%">
                  <CollectibleAsset icon={<OrdinalIcon />} name="Ordinal inscription" />
                  <RecipientAddressTypeField
                    name={recipeintFieldName}
                    label="To"
                    placeholder="Enter recipient address"
                  />
                </Flex>
              </Box>
              {currentError && <ErrorLabel>{currentError}</ErrorLabel>}
              <Button type="submit">Continue</Button>
            </Box>
          </SendInscriptionFormLoader>
        </Dialog>
      </Form>
    </Formik>
  );
}

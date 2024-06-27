import { useNavigate } from 'react-router-dom';

import { Button, Dialog, OrdinalAvatarIcon } from '@leather.io/ui';
import { Form, Formik } from 'formik';
import { Box, Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { ErrorLabel } from '@app/components/error-label';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { InscriptionPreviewCard } from '@app/components/inscription-preview-card/inscription-preview-card';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { RecipientAddressTypeField } from '../send-crypto-asset-form/components/recipient-address-type-field';
import { CollectibleAsset } from './components/collectible-asset';
import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';
import { SendInscriptionFormLoader } from './send-indcription-form-loader';

export const recipientFieldName = 'recipient';

export function SendInscriptionForm() {
  const navigate = useNavigate();
  const { feeRates, inscription, recipient } = useSendInscriptionState();
  const { chooseTransactionFee, currentError, validationSchema, isCheckingFees } =
    useSendInscriptionForm();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        [recipientFieldName]: recipient,
        inscription,
        feeRate: feeRates.hourFee.toNumber(),
      }}
      onSubmit={chooseTransactionFee}
    >
      {props => {
        return (
          <Form>
            <Dialog
              header={<DialogHeader title="Send" />}
              onGoBack={() => navigate(-1)}
              isShowing
              onClose={() => navigate(RouteUrls.Home)}
              footer={
                <Footer>
                  <Button onClick={() => props.handleSubmit()} type="submit">
                    Continue
                  </Button>
                </Footer>
              }
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
                      <CollectibleAsset icon={<OrdinalAvatarIcon />} name="Ordinal inscription" />
                      <RecipientAddressTypeField
                        name={recipientFieldName}
                        label="To"
                        placeholder="Enter recipient address"
                      />
                    </Flex>
                  </Box>
                  {currentError && <ErrorLabel>{currentError}</ErrorLabel>}
                </Box>
              </SendInscriptionFormLoader>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
}

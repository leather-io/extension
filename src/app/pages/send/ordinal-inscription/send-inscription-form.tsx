import { useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Box, Flex } from 'leather-styles/jsx';

import { Button, OrdinalAvatarIcon, Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { ErrorLabel } from '@app/components/error-label';
import { TextInputFieldError } from '@app/components/field-error';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { InscriptionPreviewCard } from '@app/components/inscription-preview-card/inscription-preview-card';

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
            <Sheet
              header={<SheetHeader title="Send" />}
              onGoBack={() => navigate(-1)}
              isShowing
              onClose={() => navigate(RouteUrls.Home)}
              footer={
                <Button
                  data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                  onClick={() => props.handleSubmit()}
                  type="submit"
                  fullWidth
                >
                  Continue
                </Button>
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
                      <TextInputFieldError name={recipientFieldName} />
                    </Flex>
                  </Box>
                  {currentError && (
                    <ErrorLabel data-testid={SendCryptoAssetSelectors.FormFieldInputErrorLabel}>
                      {currentError}
                    </ErrorLabel>
                  )}
                </Box>
              </SendInscriptionFormLoader>
            </Sheet>
          </Form>
        );
      }}
    </Formik>
  );
}

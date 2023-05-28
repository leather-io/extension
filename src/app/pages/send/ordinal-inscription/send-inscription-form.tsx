import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { InscriptionPreviewCard } from '@app/components/inscription-preview-card/inscription-preview-card';

import { RecipientField } from '../send-crypto-asset-form/components/recipient-field';
import { CollectibleAsset } from './components/collectible-asset';
import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';

export const recipeintFieldName = 'recipient';

export function SendInscriptionForm() {
  const navigate = useNavigate();
  const { feeRates, inscription, recipient } = useSendInscriptionState();
  const { chooseTransactionFee, currentError, validationSchema } = useSendInscriptionForm();

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
        <BaseDrawer title="Send" enableGoBack isShowing onClose={() => navigate(RouteUrls.Home)}>
          <Box mt="extra-loose" px="extra-loose">
            <InscriptionPreviewCard
              image={<InscriptionPreview inscription={inscription} />}
              subtitle="Ordinal inscription"
              title={inscription.title}
            />
            <Box mt={['base', 'extra-loose', '100px']}>
              <Flex flexDirection="column" mt="loose" width="100%">
                <CollectibleAsset icon={<OrdinalIcon />} name="Ordinal inscription" />
                <RecipientField
                  name={recipeintFieldName}
                  label="To"
                  placeholder="Enter recipient address"
                />
              </Flex>
            </Box>
            {currentError && (
              <ErrorLabel textAlign="left" mb="base-loose">
                {currentError}
              </ErrorLabel>
            )}
            <Button
              borderRadius="10px"
              height="48px"
              mb="extra-loose"
              mt="tight"
              type="submit"
              width="100%"
            >
              Continue
            </Button>
          </Box>
        </BaseDrawer>
      </Form>
    </Formik>
  );
}

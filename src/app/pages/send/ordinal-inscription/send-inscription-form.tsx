import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';

import { FormErrors } from '../send-crypto-asset-form/components/form-errors';
import { FormFieldsLayout } from '../send-crypto-asset-form/components/form-fields.layout';
import { RecipientField } from '../send-crypto-asset-form/components/recipient-field';
import { CollectibleAsset } from './components/collectible-asset';
import { Image } from './components/image';
import { Metadata } from './components/metadata';
import { useInscriptionSendState } from './send-inscription-container';
import { useGenerateSignedOrdinalTx } from './use-generate-ordinal-tx';
import { useOrdinalInscriptionFormValidationSchema } from './use-ordinal-inscription-form-validation-schema';

const cannotCoverFeeErrorLabel = 'Insufficient value to cover fee';
export const recipeintFieldName = 'recipient';

export function SendInscriptionForm() {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const validationSchema = useOrdinalInscriptionFormValidationSchema();
  const { inscription, utxo } = useInscriptionSendState();
  const generateTx = useGenerateSignedOrdinalTx(inscription, utxo);

  async function reviewTransaction(values: OrdinalSendFormValues) {
    const resp = generateTx(values);

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex, fee, showCannotCoverFeeError } = resp;
    if (showCannotCoverFeeError) setShowError(true);

    return navigate(RouteUrls.SendOrdinalInscriptionReview, {
      replace: true,
      state: { fee, inscription, utxo, recipient: values.recipient, tx: hex },
    });
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ [recipeintFieldName]: '' }}
      onSubmit={async values => await reviewTransaction(values)}
    >
      {form => (
        <BaseDrawer title="Send" isShowing onClose={() => navigate('../..')}>
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
              <Form style={{ width: '100%' }}>
                <FormFieldsLayout>
                  <CollectibleAsset icon={<OrdinalIcon />} name="Ordinal inscription" />
                  <RecipientField
                    lastChild
                    name={recipeintFieldName}
                    placeholder="Address or name"
                  />
                </FormFieldsLayout>
                <FormErrors />
                {showError ? <ErrorLabel>{cannotCoverFeeErrorLabel}</ErrorLabel> : null}
                <Button
                  type="button"
                  borderRadius="10px"
                  height="48px"
                  isDisabled={(!form.isValid && Boolean(form.touched)) || !form.dirty}
                  mb="base"
                  onClick={form.handleSubmit}
                  width="100%"
                >
                  Continue
                </Button>
              </Form>
            </Stack>
          </Box>
        </BaseDrawer>
      )}
    </Formik>
  );
}

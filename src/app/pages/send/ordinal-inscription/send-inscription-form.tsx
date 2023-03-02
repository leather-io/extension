import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { Form, Formik } from 'formik';

import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import {
  getNumberOfInscriptionOnUtxo,
  getNumberOfInscriptionOnUtxoWithFallbackOfOne,
} from '@app/query/bitcoin/ordinals/utils';

import { FormErrors } from '../send-crypto-asset-form/components/form-errors';
import { FormFieldsLayout } from '../send-crypto-asset-form/components/form-fields.layout';
import { RecipientField } from '../send-crypto-asset-form/components/recipient-field';
import { BtcSizeFeeEstimator } from '../send-crypto-asset-form/family/bitcoin/fees/btc-size-fee-estimator';
import { CollectibleAsset } from './components/collectible-asset';
import { CollectiblePreviewCard } from './components/collectible-preview-card';
import { useInscriptionSendState } from './send-inscription-container';
import { useGenerateSignedOrdinalTx } from './use-generate-ordinal-tx';
import { useOrdinalInscriptionFormValidationSchema } from './use-ordinal-inscription-form-validation-schema';

export const recipeintFieldName = 'recipient';

// Ord sends restricted to 1 input and 1 output
const btcTxSizer = new BtcSizeFeeEstimator();
const assumedTxSize = btcTxSizer.calcTxSize({ input_count: 1, p2tr_output_count: 1 });

function calculateInscriptionSendTxFee(feeRate: number) {
  return BigInt(Math.ceil(new BigNumber(feeRate).multipliedBy(assumedTxSize.txVBytes).toNumber()));
}

// The wallet shouldn't allow production of dust values so transfers are only
// allowed if the remainder is greater than this value
const minRemainingSizeOfUtxo = 1_500;

function canUtxoCoverFee(fee: bigint, utxoValue: number) {
  const remainder = new BigNumber(utxoValue).minus(fee.toString());
  return remainder.isGreaterThan(minRemainingSizeOfUtxo);
}

export function SendInscriptionForm() {
  const [currentError, setShowError] = useState<null | string>(null);
  const navigate = useNavigate();
  const { inscription, utxo, recipient, fees } = useInscriptionSendState();
  const validationSchema = useOrdinalInscriptionFormValidationSchema();

  const fee = calculateInscriptionSendTxFee(fees.hourFee);

  const generateTx = useGenerateSignedOrdinalTx(utxo, fee);

  async function reviewTransaction(values: OrdinalSendFormValues) {
    const resp = generateTx(values);

    if (!canUtxoCoverFee(fee, utxo.value)) {
      setShowError('To prevent loss, sending of this inscription is currently disabled.');
      return;
    }

    if (Number(inscription.offset) !== 0) {
      setShowError('Sending inscriptions at non-zero offsets is unsupported');
      return;
    }

    const numInscriptionsOnUtxo = await getNumberOfInscriptionOnUtxoWithFallbackOfOne(
      utxo.txid,
      utxo.vout
    );
    if (numInscriptionsOnUtxo !== 1) {
      setShowError('Sending inscription from utxo with multiple inscriptions is unsupported');
      return;
    }

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex } = resp;

    return navigate(RouteUrls.SendOrdinalInscriptionReview, {
      state: { fee, inscription, utxo, recipient: values.recipient, tx: hex },
    });
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ [recipeintFieldName]: recipient, inscription }}
      onSubmit={async values => await reviewTransaction(values)}
    >
      {() => (
        <Form>
          <BaseDrawer
            title="Ordinal inscription"
            enableGoBack
            isShowing
            onClose={() => navigate(RouteUrls.Home)}
          >
            <Box px="extra-loose">
              <CollectiblePreviewCard inscription={inscription} mt="extra-loose" />
              <Box mt={['base', 'extra-loose', '100px']}>
                <FormFieldsLayout>
                  <CollectibleAsset icon={<OrdinalIcon />} name="Ordinal inscription" />
                  <RecipientField
                    name={recipeintFieldName}
                    placeholder="Address or name"
                    lastChild
                  />
                </FormFieldsLayout>
              </Box>
              <FormErrors />
              {currentError && (
                <ErrorLabel textAlign="left" mb="base-loose">
                  {currentError}
                </ErrorLabel>
              )}
              <Button mb="extra-loose" type="submit" borderRadius="10px" height="48px" width="100%">
                Send
              </Button>
            </Box>
          </BaseDrawer>
        </Form>
      )}
    </Formik>
  );
}

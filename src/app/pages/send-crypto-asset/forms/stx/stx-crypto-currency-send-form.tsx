import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { RouteUrls } from '@shared/route-urls';

import { stxAmountSchema } from '@app/common/validation/currency-schema';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useStxTokenTransferUnsignedTxState } from '@app/store/transactions/token-transfer.hooks';

import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { createDefaultInitialFormValues } from '../../form-utils';

interface StacksCryptoCurrencySendFormProps {}
export function StacksCryptoCurrencySendForm({}: StacksCryptoCurrencySendFormProps) {
  const navigate = useNavigate();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);

  const initialValues = createDefaultInitialFormValues({
    fee: 0,
    feeType: FeeTypes.Unknown,
  });

  const validationSchema = yup.object({
    amount: stxAmountSchema('test error msg'),
    recipient: yup.string().defined(),
  });

  function onSubmit(values: any) {
    logger.debug('stx submitted', values);
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {form => (
        <Form>
          <FormFieldsLayout>
            <SelectedAssetField
              icon={<StxAvatar />}
              name="Stacks"
              onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
              symbol="STX"
            />
            <RecipientField />
            <MemoField lastChild />
          </FormFieldsLayout>
          <FeesRow fees={stxFees} isSponsored={false} mt="base" />
          <FormErrors />
          <PreviewButton />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </Form>
      )}
    </Formik>
  );
}

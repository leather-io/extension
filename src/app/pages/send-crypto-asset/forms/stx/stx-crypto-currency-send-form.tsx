import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { stxAmountSchema } from '@app/common/validation/currency-schema';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';

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

  const initialValues = createDefaultInitialFormValues({ fee: null });

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
          <FormErrors />
          <PreviewButton />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </Form>
      )}
    </Formik>
  );
}

import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

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

  function onSubmit(values: any) {
    logger.debug('stx submitted', values);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
      </Form>
    </Formik>
  );
}

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

interface StacksFungibleTokenSendFormProps {
  symbol: string;
}
export function StacksFungibleTokenSendForm({ symbol }: StacksFungibleTokenSendFormProps) {
  const navigate = useNavigate();

  const initialValues = createDefaultInitialFormValues({
    symbol: '',
    fee: null,
  });

  function onSubmit(values: any) {
    logger.debug(symbol + ' submitted', values);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <FormFieldsLayout>
          <SelectedAssetField
            icon={<StxAvatar />}
            name={symbol}
            onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
            symbol={symbol}
          />
          <RecipientField />
          <MemoField />
        </FormFieldsLayout>
        <FormErrors />
        <PreviewButton />
      </Form>
    </Formik>
  );
}

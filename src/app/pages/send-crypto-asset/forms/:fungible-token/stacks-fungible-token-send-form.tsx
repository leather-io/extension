import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { pullContractIdFromIdentity } from '@app/common/utils';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { useFungibleTokenAmountSchema } from '@app/pages/send-tokens/hooks/use-send-form-validation';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/fungible-tokens/fungible-token-metadata.query';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { createDefaultInitialFormValues } from '../../form-utils';
import { useStacksFtParams } from './use-stacks-ft-params';

interface StacksFungibleTokenSendFormProps {
  symbol: string;
}
export function StacksFungibleTokenSendForm({ symbol }: StacksFungibleTokenSendFormProps) {
  const navigate = useNavigate();
  const { contractId } = useStacksFtParams();
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(
    pullContractIdFromIdentity(contractId)
  );
  const ftAmountSchema = useFungibleTokenAmountSchema(contractId);

  const initialValues = createDefaultInitialFormValues({
    symbol: '',
    fee: null,
  });

  function onSubmit(values: any) {
    logger.debug(symbol + ' submitted', values);
  }

  const validationSchema = yup.object({
    amount: ftAmountSchema(),
  });

  logger.debug('info', ftMetadata, validationSchema);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {form => (
        <Form>
          <AmountField symbol={symbol.toUpperCase()} rightInputOverlay={<></>} />
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
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </Form>
      )}
    </Formik>
  );
}

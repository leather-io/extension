import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { Form, Formik, FormikHelpers } from 'formik';
import { ObjectSchema } from 'yup';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@shared/constants';
import { Fees } from '@shared/models/fees/fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { Money } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { NonceSetter } from '@app/components/nonce-setter';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';

import { FormFooter } from '../../components/form-footer';
import { MemoField } from '../../components/memo-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { StacksRecipientField } from '../../family/stacks/components/stacks-recipient-field';
import { defaultSendFormFormikProps } from '../../send-form.utils';

interface StacksCommonSendFormProps {
  onSubmit(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ): Promise<void>;
  initialValues: StacksSendFormValues;
  validationSchema: ObjectSchema<any>;
  amountField: React.JSX.Element;
  selectedAssetField: React.JSX.Element;
  availableTokenBalance: Money;
  fees?: Fees;
}

export function StacksCommonSendForm({
  onSubmit,
  initialValues,
  validationSchema,
  amountField,
  selectedAssetField,
  fees,
  availableTokenBalance,
}: StacksCommonSendFormProps) {
  const navigate = useNavigate();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  return (
    <Box width="100%" pb="base">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <NonceSetter>
              <Form>
                <SendCryptoAssetFormLayout>
                  {amountField}
                  {selectedAssetField}
                  <StacksRecipientField />
                  <MemoField />
                  <FeesRow fees={fees} isSponsored={false} mt="base" />
                  <EditNonceButton
                    alignSelf="flex-end"
                    mt="base"
                    onEditNonce={() => navigate(RouteUrls.EditNonce)}
                  />
                </SendCryptoAssetFormLayout>
                <FormFooter balance={availableTokenBalance} />
                <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
                <Outlet />
              </Form>
            </NonceSetter>
          );
        }}
      </Formik>
    </Box>
  );
}

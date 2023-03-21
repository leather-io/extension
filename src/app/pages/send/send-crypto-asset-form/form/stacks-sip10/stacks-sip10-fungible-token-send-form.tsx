import { Navigate, useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { NonceSetter } from '@app/components/nonce-setter';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';

import { AmountField } from '../../components/amount-field';
import { Footer } from '../../components/footer';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksRecipientField } from '../../family/stacks/components/stacks-recipient-field/stacks-recipient-field';
import { defaultSendFormFormikProps } from '../../send-form.utils';
import { useSip10SendForm } from './use-sip10-send-form';

export function StacksSip10FungibleTokenSendForm({}) {
  const navigate = useNavigate();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  const {
    availableTokenBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stacksFtFees,
    symbol,
    validationSchema,
  } = useSip10SendForm();

  if (!isString(symbol)) {
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  return (
    <SendCryptoAssetFormLayout>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, formikHelpers) => await previewTransaction(values, formikHelpers)}
        validationSchema={validationSchema}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <NonceSetter>
              <Form>
                <FormFieldsLayout>
                  <AmountField
                    balance={availableTokenBalance}
                    bottomInputOverlay={
                      <SendMaxButton
                        balance={availableTokenBalance}
                        sendMaxBalance={sendMaxBalance.toString()}
                      />
                    }
                  />
                  <SelectedAssetField icon={<StxAvatar />} name={symbol} symbol={symbol} />
                  <StacksRecipientField />
                  <MemoField />
                  <FeesRow fees={stacksFtFees} isSponsored={false} mt="base" />
                  <EditNonceButton
                    alignSelf="flex-end"
                    mb="extra-loose"
                    mt="base"
                    onEditNonce={() => navigate(RouteUrls.EditNonce)}
                  />
                </FormFieldsLayout>
                <Footer balance={availableTokenBalance} url={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
              </Form>
            </NonceSetter>
          );
        }}
      </Formik>
    </SendCryptoAssetFormLayout>
  );
}

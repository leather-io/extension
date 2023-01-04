import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { RouteUrls } from '@shared/route-urls';

import { formatPrecisionError } from '@app/common/error-formatters';
import { FormErrorMessages } from '@app/common/error-messages';
import { stxAddressValidator } from '@app/common/validation/forms/address-validators';
import { stxAmountValidator } from '@app/common/validation/forms/currency-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { EditNonceButton } from '@app/components/edit-nonce-button';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useStxTokenTransferUnsignedTxState } from '@app/store/transactions/token-transfer.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { createDefaultInitialFormValues } from '../../form-utils';

interface StxCryptoCurrencySendFormProps {}
export function StxCryptoCurrencySendForm({}: StxCryptoCurrencySendFormProps) {
  const navigate = useNavigate();
  const { data: nextNonce } = useNextNonce();
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  const availableStxBalance = balances?.stx.availableStx;

  const initialValues = createDefaultInitialFormValues({
    fee: '',
    feeType: FeeTypes.Unknown,
    nonce: nextNonce?.nonce,
  });

  const validationSchema = yup.object({
    amount: stxAmountValidator(formatPrecisionError(availableStxBalance)),
    recipient: stxAddressValidator(FormErrorMessages.InvalidAddress),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    fee: stxFeeValidator(availableStxBalance),
    nonce: nonceValidator,
  });

  function onSubmit(values: any) {
    logger.debug('stx submitted', values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <AmountField symbol="STX" rightInputOverlay={<SendAllButton />} />
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
        <EditNonceButton onEditNonce={() => navigate(RouteUrls.EditNonce)} my={['loose', 'base']} />
        <Outlet />
      </Form>
    </Formik>
  );
}

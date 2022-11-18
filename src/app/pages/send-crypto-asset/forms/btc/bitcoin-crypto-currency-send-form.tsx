import { useNavigate } from 'react-router-dom';

import { validate } from 'bitcoin-address-validation';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentAccountBtcAddressState } from '@app/store/accounts/account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { createDefaultInitialFormValues } from '../../form-utils';
import { amountFieldValidator } from '../../validators/amount-validators';

interface BitcoinCryptoCurrencySendFormProps {}
export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
  const currentAccountBtcAddress = useCurrentAccountBtcAddressState();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const navigate = useNavigate();

  logger.debug('btc balance', btcCryptoCurrencyAssetBalance);

  const initialValues = createDefaultInitialFormValues({
    symbol: '',
    memo: '',
    fee: null,
  });

  function onSubmit() {
    logger.debug('form submit');
  }

  const validationSchema = yup.object({
    amount: amountFieldValidator,
    recipient: yup.string().test((input, context) => {
      if (!input) return false;
      if (!validate(input)) return context.createError({ message: 'Invalid bitcoin address' });
      return true;
    }),
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      <Form>
        <AmountField rightInputOverlay={<SendAllButton />} />
        <FormFieldsLayout>
          <SelectedAssetField
            icon={<BtcIcon />}
            name={btcCryptoCurrencyAssetBalance.asset.name}
            onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
            symbol="BTC"
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

import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

<<<<<<<< HEAD:src/app/pages/send/send-crypto-asset-form/btc/btc-crypto-currency-send-form.tsx
import { formatPrecisionError } from '@app/common/error-formatters';
import { useWalletType } from '@app/common/use-wallet-type';
import { btcAddressValidator } from '@app/common/validation/forms/address-validators';
import { btcAmountValidator } from '@app/common/validation/forms/currency-validators';
import { btcFeeValidator } from '@app/common/validation/forms/fee-validators';
|||||||| d62440114:src/app/pages/send-crypto-asset/forms/btc/btc-crypto-currency-send-form.tsx
import { btcAmountSchema } from '@app/common/validation/currency-schema';
========
import { formatPrecisionError } from '@app/common/error-formatters';
import { btcAddressValidator } from '@app/common/validation/forms/address-validators';
import { btcAmountValidator } from '@app/common/validation/forms/currency-validators';
import { btcFeeValidator } from '@app/common/validation/forms/fee-validators';
>>>>>>>> origin/main:src/app/pages/send/send-crypto-asset-form/forms/btc/btc-crypto-currency-send-form.tsx
import { FeesRow } from '@app/components/fees-row/fees-row';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinFees } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCurrentAccountBtcAddressState } from '@app/store/accounts/account.hooks';

<<<<<<<< HEAD:src/app/pages/send/send-crypto-asset-form/btc/btc-crypto-currency-send-form.tsx
import { AmountField } from '../_components/amount-field';
import { FormErrors } from '../_components/form-errors';
import { FormFieldsLayout } from '../_components/form-fields.layout';
import { MemoField } from '../_components/memo-field';
import { PreviewButton } from '../_components/preview-button';
import { RecipientField } from '../_components/recipient-field';
import { SelectedAssetField } from '../_components/selected-asset-field';
import { SendAllButton } from '../_components/send-all-button';
import { createDefaultInitialFormValues } from '../send-form.utils';
|||||||| d62440114:src/app/pages/send-crypto-asset/forms/btc/btc-crypto-currency-send-form.tsx
import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { createDefaultInitialFormValues } from '../../form-utils';
import { btcAddressValidator } from '../../validators/recipient-validators';
========
import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { createDefaultInitialFormValues } from '../../form-utils';
>>>>>>>> origin/main:src/app/pages/send/send-crypto-asset-form/forms/btc/btc-crypto-currency-send-form.tsx

<<<<<<<< HEAD:src/app/pages/send/send-crypto-asset-form/btc/btc-crypto-currency-send-form.tsx
export function BtcCryptoCurrencySendForm() {
|||||||| d62440114:src/app/pages/send-crypto-asset/forms/btc/btc-crypto-currency-send-form.tsx
interface BitcoinCryptoCurrencySendFormProps {}
export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
========
interface BtcCryptoCurrencySendFormProps {}
export function BtcCryptoCurrencySendForm({}: BtcCryptoCurrencySendFormProps) {
>>>>>>>> origin/main:src/app/pages/send/send-crypto-asset-form/forms/btc/btc-crypto-currency-send-form.tsx
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountBtcAddressState();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const { whenWallet } = useWalletType();
  /*
    TODO: Replace hardcoded median (226) with the tx byte length?
    Median source: https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
    tx size = in*180 + out*34 + 10 plus or minus 'in'
  */
  const { data: btcFees } = useBitcoinFees(226);

  logger.debug('btc balance', btcCryptoCurrencyAssetBalance);
  logger.debug('btc fees', btcFees);

  const initialValues: BitcoinSendFormValues = createDefaultInitialFormValues({
    amount: '',
    fee: '',
    feeCurrency: 'BTC',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    recipient: '',
    symbol: '',
  });

  const validationSchema = yup.object({
    amount: btcAmountValidator(formatPrecisionError(btcCryptoCurrencyAssetBalance.balance)),
    recipient: btcAddressValidator(),
    fee: btcFeeValidator(btcCryptoCurrencyAssetBalance.balance),
  });

  // TODO: Placeholder function
  async function previewTransaction(values: BitcoinSendFormValues) {
    logger.debug('btc form values', values);

    whenWallet({
      software: () => {},
      ledger: () => {},
    })();
  }

  return (
<<<<<<<< HEAD:src/app/pages/send/send-crypto-asset-form/btc/btc-crypto-currency-send-form.tsx
    <Formik
      initialValues={initialValues}
      onSubmit={async values => await previewTransaction(values)}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
|||||||| d62440114:src/app/pages/send-crypto-asset/forms/btc/btc-crypto-currency-send-form.tsx
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
========
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
>>>>>>>> origin/main:src/app/pages/send/send-crypto-asset-form/forms/btc/btc-crypto-currency-send-form.tsx
      <Form>
        <AmountField symbol="BTC" rightInputOverlay={<SendAllButton />} />
        <FormFieldsLayout>
          <SelectedAssetField
            icon={<BtcIcon />}
            name={btcCryptoCurrencyAssetBalance.asset.name}
            onClickAssetGoBack={() => navigate(RouteUrls.SendCryptoAsset)}
            symbol="BTC"
          />
          <RecipientField />
          <MemoField lastChild />
        </FormFieldsLayout>
        <FeesRow fees={btcFees} isSponsored={false} mt="base" />
        <FormErrors />
        <PreviewButton />
      </Form>
    </Formik>
  );
}

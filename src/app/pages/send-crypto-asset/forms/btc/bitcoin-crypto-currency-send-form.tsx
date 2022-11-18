import { useNavigate } from 'react-router-dom';

import { getAddressInfo } from 'bitcoin-address-validation';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentAccountBtcAddressState } from '@app/store/accounts/account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { amountFieldValidator } from '../../validators/amount-validators';

interface BitcoinCryptoCurrencySendFormProps {}
export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
  const currentAccountBtcAddress = useCurrentAccountBtcAddressState();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const navigate = useNavigate();

  logger.debug('btc balance', btcCryptoCurrencyAssetBalance);

  const initialValues = {
    amount: '',
    symbol: '',
    recipient: '',
    memo: '',
    fee: null,
  };

  function onSubmit() {
    console.log('form submit');
  }

  const validationSchema = yup.object({
    amount: amountFieldValidator,
    recipient: yup.string().test(input => {
      if (!input) return false;
      try {
        const addressInfo = getAddressInfo(input);
        console.log(addressInfo);
        return addressInfo.bech32;
      } catch (e) {
        return false;
      }
    }),
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      <Form>
        <fieldset>
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
        </fieldset>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';

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
    fee: null,
  };

  function onSubmit() {}

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
      </Form>
    </Formik>
  );
}

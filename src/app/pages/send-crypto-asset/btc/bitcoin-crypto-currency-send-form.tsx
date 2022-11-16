import { Form, Formik } from 'formik';

import { logger } from '@shared/logger';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentAccountBtcAddressState } from '@app/store/accounts/account.hooks';

import { AmountField } from '../components/amount-field';
import { FormFields } from '../components/form-fields';
import { SendAllButton } from '../components/send-all-button';

interface BitcoinCryptoCurrencySendFormProps {}
export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
  const currentAccountBtcAddress = useCurrentAccountBtcAddressState();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);

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
          <FormFields assetBalance={btcCryptoCurrencyAssetBalance} icon={<BtcIcon />} />
          {/* <label>
            Fee (in sats)
            <input type="number" />
          </label> */}
        </fieldset>
        {/* <button>Send BTC</button> */}
      </Form>
    </Formik>
  );
}

import { Form, Formik } from 'formik';

import { logger } from '@shared/logger';

import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentAccountBtcAddressState } from '@app/store/accounts/account.hooks';

import { AmountField } from '../send-crypto-asset-form/components/amount-field';
import { SendAllButton } from '../send-crypto-asset-form/components/send-all-button';

interface BitcoinCryptoCurrencySendFormProps {}
export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
  const currentAccountBtcAddress = useCurrentAccountBtcAddressState();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);

  logger.debug('btc balance', btcCryptoCurrencyAssetBalance);

  const initialValues = {
    amount: null,
    recipient: null,
    fee: null,
  };

  function onSubmit() {}

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <legend>BTC Send Form</legend>
        <fieldset>
          <AmountField rightInputOverlay={<SendAllButton />} />

          <label>
            Recipient
            <input type="text" />
          </label>
          <label>
            Fee (in sats)
            <input type="number" />
          </label>
        </fieldset>
        <button>Send BTC</button>
      </Form>
    </Formik>
  );
}

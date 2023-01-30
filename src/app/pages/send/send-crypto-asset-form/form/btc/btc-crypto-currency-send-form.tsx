import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { formatPrecisionError } from '@app/common/error-formatters';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { btcAddressValidator } from '@app/common/validation/forms/address-validators';
import { btcAmountValidator } from '@app/common/validation/forms/currency-validators';
import { btcFeeValidator } from '@app/common/validation/forms/fee-validators';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinFees } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCurrentAccountBtcAddress } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { createDefaultInitialFormValues } from '../../send-form.utils';

export function BtcCryptoCurrencySendForm() {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentAccountBtcAddress();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const { whenWallet } = useWalletType();
  /*
    TODO: Replace hardcoded median (226) with the tx byte length?
    Median source: https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
    tx size = in*180 + out*34 + 10 plus or minus 'in'
  */
  const { data: btcFees } = useBitcoinFees(226);

  const availableBtcBalance = btcCryptoCurrencyAssetBalance.balance ?? createMoney(0, 'STX');
  const sendAllBalance = useMemo(
    () => convertAmountToBaseUnit(availableBtcBalance),
    [availableBtcBalance]
  );

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
    <Formik
      initialValues={initialValues}
      onSubmit={async values => await previewTransaction(values)}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {props => (
        <Form style={{ width: '100%' }}>
          <AmountField
            balance={availableBtcBalance}
            bottomInputOverlay={
              <SendAllButton
                balance={availableBtcBalance}
                sendAllBalance={sendAllBalance.minus(props.values.fee).toString()}
              />
            }
          />
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
          <PreviewButton
            isDisabled={!(props.values.amount && props.values.recipient && props.values.fee)}
          />
        </Form>
      )}
    </Formik>
  );
}

import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { BTC_DECIMALS } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { formatPrecisionError } from '@app/common/error-formatters';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { btcAddressValidator } from '@app/common/validation/forms/address-validators';
import { btcCurrencyAmountValidator } from '@app/common/validation/forms/currency-validators';
import { btcFeeValidator } from '@app/common/validation/forms/fee-validators';
import { FeesRow } from '@app/components/fees-row/fees-row';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinPendingTransactionsBalance } from '@app/query/bitcoin/address/transactions-by-address.hooks';
import { useBitcoinFeeRatesInVbytes } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { MemoField } from '../../components/memo-field';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { createDefaultInitialFormValues } from '../../send-form.utils';
import { useGenerateBitcoinRawTx } from './use-generate-bitcoin-raw-tx';

export function BtcCryptoCurrencySendForm() {
  const navigate = useNavigate();
  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const pendingTxsBalance = useBitcoinPendingTransactionsBalance();
  const generateTx = useGenerateBitcoinRawTx();

  /*
    TODO: Replace hardcoded median (226) with the tx byte length?
    Median source: https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-fees
    tx size = in*180 + out*34 + 10 plus or minus 'in'
  */
  const { data: btcFees } = useBitcoinFeeRatesInVbytes();
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();

  const availableBtcBalance = btcCryptoCurrencyAssetBalance.balance ?? createMoney(0, 'STX');
  const sendAllBalance = useMemo(
    () =>
      convertAmountToBaseUnit(
        availableBtcBalance.amount.minus(pendingTxsBalance.amount),
        BTC_DECIMALS
      ),
    [availableBtcBalance, pendingTxsBalance]
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
    amount: btcCurrencyAmountValidator(formatPrecisionError(btcCryptoCurrencyAssetBalance.balance)),
    recipient: btcAddressValidator(),
    fee: btcFeeValidator(btcCryptoCurrencyAssetBalance.balance),
  });

  // TODO: Placeholder function
  async function previewTransaction(values: BitcoinSendFormValues) {
    logger.debug('btc form values', values);

    const tx = generateTx(values);
    if (!tx) return logger.error('Attempted to generate raw tx, but no tx exists');

    whenWallet({
      software: () => sendFormNavigate.toConfirmAndSignBtcTransaction(tx, values.recipient),
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
              symbol="BTC"
            />
            <RecipientField
              name="recipient"
              onClickLabelAction={() => navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts)}
            />
            <MemoField lastChild />
          </FormFieldsLayout>
          <FeesRow fees={btcFees} isSponsored={false} mt="base" />
          <FormErrors />
          <PreviewButton
            isDisabled={!(props.values.amount && props.values.recipient && props.values.fee)}
          />
          <Outlet />
        </Form>
      )}
    </Formik>
  );
}

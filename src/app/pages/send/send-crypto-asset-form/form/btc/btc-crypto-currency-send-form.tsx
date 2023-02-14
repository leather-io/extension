import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import {
  BTC_DECIMALS,
  HIGH_FEE_AMOUNT_BTC,
  HIGH_FEE_WARNING_LEARN_MORE_URL_BTC,
} from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { isEmpty } from '@shared/utils';

import { formatPrecisionError } from '@app/common/error-formatters';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { useWalletType } from '@app/common/use-wallet-type';
import { btcAddressValidator } from '@app/common/validation/forms/address-validators';
import { ExternalLink } from '@app/components/external-link';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { WarningLabel } from '@app/components/warning-label';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useBitcoinPendingTransactionsBalance } from '@app/query/bitcoin/address/transactions-by-address.hooks';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { createDefaultInitialFormValues } from '../../send-form.utils';

export function BtcCryptoCurrencySendForm() {
  const navigate = useNavigate();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
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
    // fee: btcFeeValidator(btcCryptoCurrencyAssetBalance.balance),
  });

  async function previewTransaction(
    values: BitcoinSendFormValues,
    formikHelpers: FormikHelpers<BitcoinSendFormValues>
  ) {
    logger.debug('btc form values', values);
    // Validate and check high fee warning first
    const formErrors = await formikHelpers.validateForm();
    if (!isShowingHighFeeConfirmation && isEmpty(formErrors) && values.fee > HIGH_FEE_AMOUNT_BTC) {
      return setIsShowingHighFeeConfirmation(true);
    }

    const resp = generateTx(values);
    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex, fee } = resp;

    whenWallet({
      software: () => sendFormNavigate.toConfirmAndSignBtcTransaction(hex, values.recipient, fee),
      ledger: () => toast.error('Bitcon on Ledger not supported'),
    })();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, formikHelpers) => await previewTransaction(values, formikHelpers)}
      validateOnBlur={false}
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
                // sendAllBalance={sendAllBalance.minus(props.values.fee).toString()}
                sendAllBalance={sendAllBalance
                  // hack to ensure there's a margin for fee
                  .multipliedBy(0.99)
                  .decimalPlaces(BTC_DECIMALS)
                  .toString()}
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
              labelAction="Choose account"
              name="recipient"
              onClickLabelAction={() => navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts)}
            />
          </FormFieldsLayout>
          {/* <FeesRow fees={btcFees} isSponsored={false} allowCustom={false} mt="base" /> */}
          <WarningLabel mt="base-loose" width="100%">
            This is a Bitcoin testnet transaction. Funds have no value.{' '}
            <ExternalLink href="https://coinfaucet.eu/en/btc-testnet">
              Get testnet BTC here ↗
            </ExternalLink>
          </WarningLabel>
          <FormErrors />
          <PreviewButton isDisabled={!props.isValid} />
          <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
          <Outlet />
        </Form>
      )}
    </Formik>
  );
}

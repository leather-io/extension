import { Outlet, useNavigate } from 'react-router-dom';

import { color } from '@stacks/ui-utils';
import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { HIGH_FEE_AMOUNT_BTC, HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';
import { logger } from '@shared/logger';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { isEmpty } from '@shared/utils';

import { formatPrecisionError } from '@app/common/error-formatters';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  btcAddressNetworkValidatorFactory,
  btcAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { btcCurrencyAmountValidator } from '@app/common/validation/forms/currency-validators';
import { ExternalLink } from '@app/components/external-link';
import { Header } from '@app/components/header';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { WarningLabel } from '@app/components/warning-label';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { AmountField } from '../../components/amount-field';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendAllButton } from '../../components/send-all-button';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';
import { useGenerateSignedBitcoinTx } from './use-generate-bitcoin-raw-tx';

export function BtcCryptoCurrencySendForm() {
  useRouteHeader(<Header hideActions onClose={() => navigate(-1)} title="Send" />);

  const navigate = useNavigate();
  const routeState = useSendFormRouteState();
  const sendFormNavigate = useSendFormNavigate();

  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();
  const { whenWallet } = useWalletType();

  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);
  const generateTx = useGenerateSignedBitcoinTx();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();

  const initialValues: BitcoinSendFormValues = createDefaultInitialFormValues({
    ...routeState,
    fee: '',
    feeCurrency: 'BTC',
    feeType: FeeTypes[FeeTypes.Middle],
    memo: '',
    symbol: '',
  });

  const network = useCurrentNetwork();

  const validationSchema = yup.object({
    amount: btcCurrencyAmountValidator(formatPrecisionError(btcCryptoCurrencyAssetBalance.balance)),
    recipient: btcAddressValidator().test({
      test: btcAddressNetworkValidatorFactory(network.chain.bitcoin.network),
      message: 'Bitcoin address targets wrong network',
    }),
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
      ledger: () => {},
    })();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, formikHelpers) => await previewTransaction(values, formikHelpers)}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {props => (
        <Form style={{ width: '100%' }}>
          <AmountField
            balance={btcCryptoCurrencyAssetBalance.balance}
            bottomInputOverlay={
              <SendAllButton
                balance={btcCryptoCurrencyAssetBalance.balance}
                sendAllBalance={
                  calcMaxSpend(props.values.recipient)?.spendableBitcoin.toString() ?? '0'
                }
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
          <WarningLabel mt="base-loose" width="100%">
            This is a Bitcoin testnet transaction. Funds have no value.{' '}
            <ExternalLink
              href="https://coinfaucet.eu/en/btc-testnet"
              color={color('text-body')}
              textDecoration="underline"
            >
              Get testnet BTC here ↗
            </ExternalLink>
          </WarningLabel>
          {/* <Flex justifyContent="space-between" mt="base">
            <Caption>Fee</Caption>
            <Caption>{calcFee(props.values.amount)?.toString()}</Caption>
          </Flex> */}
          <FormErrors />
          <PreviewButton isDisabled={!(props.values.amount && props.values.recipient)} />
          <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
          <Outlet />
        </Form>
      )}
    </Formik>
  );
}

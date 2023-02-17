import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';
import { FeeTypes } from '@shared/models/fees/_fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { AmountField } from '../../components/amount-field';
import { AvailableBalance } from '../../components/available-balance';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendMaxButton } from '../../components/send-max-button';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultFormikProps } from '../../send-form.utils';
import { TestnetBtcMessage } from './components/testnet-btc-message';
import { useBtcSendForm } from './use-btc-send-form';

export function BtcSendForm() {
  useRouteHeader(<Header hideActions onClose={() => navigate(-1)} title="Send" />);

  const navigate = useNavigate();
  const routeState = useSendFormRouteState();

  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance =
    useBitcoinCryptoCurrencyAssetBalance(currentAccountBtcAddress);

  const calcMaxSpend = useCalculateMaxBitcoinSpend();

  const { validationSchema, currentNetwork, previewTransaction } = useBtcSendForm();

  const initialValues: BitcoinSendFormValues = createDefaultInitialFormValues({
    ...routeState,
    fee: '',
    feeCurrency: 'BTC',
    feeType: FeeTypes[FeeTypes.Middle],
    memo: '',
    symbol: '',
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={previewTransaction}
      validationSchema={validationSchema}
      {...defaultFormikProps}
    >
      {props => (
        <Form>
          <AmountField
            balance={btcCryptoCurrencyAssetBalance.balance}
            bottomInputOverlay={
              <SendMaxButton
                balance={btcCryptoCurrencyAssetBalance.balance}
                sendMaxBalance={
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
              lastChild
              name="recipient"
              onClickLabelAction={() => navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts)}
            />
          </FormFieldsLayout>

          {currentNetwork.chain.bitcoin.network === 'testnet' && <TestnetBtcMessage />}

          <FormErrors />
          <PreviewButton />
          <Box my="base">
            <AvailableBalance availableBalance={btcCryptoCurrencyAssetBalance.balance} />
          </Box>
          <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
          <Outlet />
        </Form>
      )}
    </Formik>
  );
}

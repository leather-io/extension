import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useBitcoinAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { AmountField } from '../../components/amount-field';
import { AvailableBalance } from '../../components/available-balance';
import { FormErrors } from '../../components/form-errors';
import { FormFieldsLayout } from '../../components/form-fields.layout';
import { PreviewButton } from '../../components/preview-button';
import { RecipientField } from '../../components/recipient-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendMaxButton } from '../../components/send-max-button';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { TestnetBtcMessage } from './components/testnet-btc-message';
import { useBtcSendForm } from './use-btc-send-form';

export function BtcSendForm() {
  const navigate = useNavigate();
  const routeState = useSendFormRouteState();

  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcBalance = useBitcoinAssetBalance(currentAccountBtcAddress);

  const calcMaxSpend = useCalculateMaxBitcoinSpend();

  const { validationSchema, currentNetwork, formRef, previewTransaction, onFormStateChange } =
    useBtcSendForm();

  return (
    <SendCryptoAssetFormLayout>
      <Formik
        initialValues={createDefaultInitialFormValues(routeState)}
        onSubmit={previewTransaction}
        validationSchema={validationSchema}
        innerRef={formRef}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <Form>
              <AmountField
                balance={btcBalance.balance}
                bottomInputOverlay={
                  <SendMaxButton
                    balance={btcBalance.balance}
                    sendMaxBalance={
                      calcMaxSpend(props.values.recipient)?.spendableBitcoin.toString() ?? '0'
                    }
                  />
                }
              />
              <FormFieldsLayout>
                <SelectedAssetField icon={<BtcIcon />} name={btcBalance.asset.name} symbol="BTC" />
                <RecipientField
                  labelAction="Choose account"
                  name="recipient"
                  onClickLabelAction={() =>
                    navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts)
                  }
                  placeholder="Address"
                />
              </FormFieldsLayout>
              {currentNetwork.chain.bitcoin.network === 'testnet' && <TestnetBtcMessage />}
              <FormErrors />
              <PreviewButton />
              <Box my="base">
                <AvailableBalance availableBalance={btcBalance.balance} />
              </Box>
              <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
              <Outlet />
            </Form>
          );
        }}
      </Formik>
    </SendCryptoAssetFormLayout>
  );
}

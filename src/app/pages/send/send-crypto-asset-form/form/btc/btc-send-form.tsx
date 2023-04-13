import { Outlet } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormFooter } from '../../components/form-footer';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { BitcoinRecipientField } from '../../family/bitcoin/components/bitcoin-recipient-field';
import { TestnetBtcMessage } from '../../family/bitcoin/components/testnet-btc-message';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useBtcSendForm } from './use-btc-send-form';

export function BtcSendForm() {
  const routeState = useSendFormRouteState();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcBalance = useNativeSegwitBalance(currentAccountBtcAddress);

  const {
    calcMaxSpend,
    currentNetwork,
    formRef,
    onFormStateChange,
    chooseTransactionFee,
    validationSchema,
  } = useBtcSendForm();

  return (
    <Box width="100%" pb="base">
      <Formik
        initialValues={createDefaultInitialFormValues({
          ...routeState,
          recipientBnsName: '',
        })}
        onSubmit={chooseTransactionFee}
        validationSchema={validationSchema}
        innerRef={formRef}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <Form>
              <SendCryptoAssetFormLayout>
                <AmountField
                  balance={btcBalance.balance}
                  switchableAmount={
                    <SendFiatValue marketData={btcMarketData} assetSymbol={'BTC'} />
                  }
                  bottomInputOverlay={
                    <SendMaxButton
                      balance={btcBalance.balance}
                      sendMaxBalance={
                        calcMaxSpend(props.values.recipient)?.spendableBitcoin.toString() ?? '0'
                      }
                    />
                  }
                  autoComplete="off"
                />
                <SelectedAssetField icon={<BtcIcon />} name={btcBalance.asset.name} symbol="BTC" />
                <BitcoinRecipientField />
                {currentNetwork.chain.bitcoin.network === 'testnet' && <TestnetBtcMessage />}
              </SendCryptoAssetFormLayout>
              <FormFooter balance={btcBalance.balance} />
              <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
              <Outlet />

              {/* This is for testing purposes only, to make sure the form is ready to be submitted */}
              {calcMaxSpend(props.values.recipient).spendableBitcoin.toNumber() > 0 ? (
                <Box data-testid={SendCryptoAssetSelectors.SendPageReady}></Box>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

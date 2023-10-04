import { Outlet } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';
import { CryptoCurrencies } from '@shared/models/currencies.model';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { HighFeeDrawer } from '@app/features/high-fee-drawer/high-fee-drawer';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { AmountField } from '../../components/amount-field';
import { FormFooter } from '../../components/form-footer';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendFiatValue } from '../../components/send-fiat-value';
import { BitcoinRecipientField } from '../../family/bitcoin/components/bitcoin-recipient-field';
import { BitcoinSendMaxButton } from '../../family/bitcoin/components/bitcoin-send-max-button';
import { TestnetBtcMessage } from '../../family/bitcoin/components/testnet-btc-message';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useBtcSendForm } from './use-btc-send-form';

const symbol: CryptoCurrencies = 'BTC';

export function BtcSendForm() {
  const routeState = useSendFormRouteState();
  const btcMarketData = useCryptoCurrencyMarketData(symbol);

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const btcBalance = useNativeSegwitBalance(nativeSegwitSigner.address);

  const {
    calcMaxSpend,
    chooseTransactionFee,
    currentNetwork,
    formRef,
    isSendingMax,
    onFormStateChange,
    onSetIsSendingMax,
    utxos,
    validationSchema,
  } = useBtcSendForm();

  return (
    <Box width="100%" pb="base">
      <Formik
        initialValues={createDefaultInitialFormValues({
          ...routeState,
          recipientBnsName: '',
          symbol,
        })}
        onSubmit={chooseTransactionFee}
        validationSchema={validationSchema}
        innerRef={formRef}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          const sendMaxCalculation = calcMaxSpend(props.values.recipient, utxos);

          return (
            <Form>
              <SendCryptoAssetFormLayout>
                <AmountField
                  autoComplete="off"
                  balance={btcBalance.balance}
                  bottomInputOverlay={
                    <BitcoinSendMaxButton
                      balance={btcBalance.balance}
                      isSendingMax={isSendingMax}
                      onSetIsSendingMax={onSetIsSendingMax}
                      sendMaxBalance={sendMaxCalculation.spendableBitcoin.toString()}
                      sendMaxFee={sendMaxCalculation.spendAllFee.toString()}
                    />
                  }
                  onSetIsSendingMax={onSetIsSendingMax}
                  isSendingMax={isSendingMax}
                  switchableAmount={
                    <SendFiatValue marketData={btcMarketData} assetSymbol={symbol} />
                  }
                />
                <SelectedAssetField
                  icon={<BtcIcon />}
                  name={btcBalance.asset.name}
                  symbol={symbol}
                />
                <BitcoinRecipientField />
                {currentNetwork.chain.bitcoin.network === 'testnet' && <TestnetBtcMessage />}
              </SendCryptoAssetFormLayout>
              <FormFooter balance={btcBalance.balance} />
              <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
              <Outlet />

              {/* This is for testing purposes only, to make sure the form is ready to be submitted. */}
              {calcMaxSpend(props.values.recipient, utxos).spendableBitcoin.toNumber() > 0 ? (
                <Box data-testid={SendCryptoAssetSelectors.SendPageReady}></Box>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

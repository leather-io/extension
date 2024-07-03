import { Outlet } from 'react-router-dom';

import type { CryptoCurrencies } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { BtcAvatarIcon, Button, Callout, Link } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import { AvailableBalance } from '@app/features/container/containers/footers/available-balance';
import { Footer } from '@app/features/container/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { TransferRecipientField } from '../../family/bitcoin/components/bitcoin-recipient-field';
import { BitcoinSendMaxButton } from '../../family/bitcoin/components/bitcoin-send-max-button';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useBtcSendForm } from './use-btc-send-form';

const symbol: CryptoCurrencies = 'BTC';

export function BtcSendForm() {
  const routeState = useSendFormRouteState();
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  const {
    balance,
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
    <Box width="100%" pb="space.04">
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
              <Card
                footer={
                  <Footer variant="card">
                    <Button
                      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                      onClick={() => props.handleSubmit()}
                      type="submit"
                    >
                      Continue
                    </Button>
                    <AvailableBalance balance={formatMoney(balance.availableBalance)} />
                  </Footer>
                }
              >
                <CardContent dataTestId={SendCryptoAssetSelectors.SendForm}>
                  <AmountField
                    autoComplete="off"
                    balance={balance.availableBalance}
                    bottomInputOverlay={
                      <BitcoinSendMaxButton
                        balance={balance.availableBalance}
                        isSendingMax={isSendingMax}
                        onSetIsSendingMax={onSetIsSendingMax}
                        sendMaxBalance={sendMaxCalculation.spendableBitcoin.toString()}
                        sendMaxFee={sendMaxCalculation.spendAllFee.toString()}
                      />
                    }
                    onSetIsSendingMax={onSetIsSendingMax}
                    isSendingMax={isSendingMax}
                    switchableAmount={
                      <SendFiatValue marketData={marketData} assetSymbol={symbol} />
                    }
                  />
                  <SelectedAssetField icon={<BtcAvatarIcon />} name="Bitcoin" symbol={symbol} />
                  <TransferRecipientField />
                  {currentNetwork.chain.bitcoin.bitcoinNetwork === 'testnet' && (
                    <Callout variant="warning" title="Funds have no value" mt="space.04">
                      This is a Bitcoin testnet transaction.
                      <Link
                        variant="text"
                        href="https://coinfaucet.eu/en/btc-testnet"
                        textStyle="caption.01"
                      >
                        Get testnet BTC here ↗
                      </Link>
                    </Callout>
                  )}
                </CardContent>
              </Card>
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

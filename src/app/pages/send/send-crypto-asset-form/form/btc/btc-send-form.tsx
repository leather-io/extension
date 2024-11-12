import { Outlet } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import type { CryptoCurrency } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { BtcAvatarIcon, Button, Callout, Link } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';

import { AvailableBalance, ButtonRow, Card, Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { TransferRecipientField } from '../../family/bitcoin/components/bitcoin-recipient-field';
import { BitcoinSendMaxButton } from '../../family/bitcoin/components/bitcoin-send-max-button';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useBtcSendForm } from './use-btc-send-form';

const symbol: CryptoCurrency = 'BTC';

export function BtcSendForm() {
  const routeState = useSendFormRouteState();
  const isPrivate = useIsPrivateMode();
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
    <>
      <PageHeader title="Send" />
      <Content>
        <Page>
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
                    dataTestId={SendCryptoAssetSelectors.SendForm}
                    footer={
                      <ButtonRow>
                        <Button
                          aria-busy={props.isValidating}
                          data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                          type="submit"
                        >
                          Continue
                        </Button>
                        <AvailableBalance
                          balance={formatMoney(balance.availableBalance)}
                          isPrivate={isPrivate}
                        />
                      </ButtonRow>
                    }
                  >
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
                    {currentNetwork.chain.bitcoin.mode === 'testnet' && (
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
        </Page>
      </Content>
    </>
  );
}

import { Outlet, useLocation } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import type { MarketData, Money } from '@leather.io/models';
import { Brc20AvatarIcon, Button, Callout, Link } from '@leather.io/ui';
import { convertAmountToBaseUnit, formatMoney } from '@leather.io/utils';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import {
  AvailableBalance,
  ButtonRow,
  Card,
  CardContent,
  Content,
  Page,
} from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { defaultSendFormFormikProps } from '../../send-form.utils';
import { useBrc20SendForm } from './use-brc20-send-form';

function useBrc20SendFormRouteState() {
  const { state } = useLocation();
  return {
    balance: get(state, 'balance', '') as Money,
    ticker: get(state, 'ticker', '') as string,
    holderAddress: get(state, 'holderAddress', '') as string,
    marketData: get(state, 'marketData') as MarketData,
  };
}

export function Brc20SendForm() {
  const { balance, ticker, holderAddress, marketData } = useBrc20SendFormRouteState();
  const { initialValues, chooseTransactionFee, validationSchema, formRef, onFormStateChange } =
    useBrc20SendForm({ balance, ticker, holderAddress });

  return (
    <>
      <PageHeader title="Send" />
      <Content>
        <Page>
          <Formik
            initialValues={initialValues}
            onSubmit={chooseTransactionFee}
            validationSchema={validationSchema}
            innerRef={formRef}
            {...defaultSendFormFormikProps}
          >
            {props => {
              onFormStateChange(props.values);
              return (
                <Form>
                  <Card
                    footer={
                      <ButtonRow>
                        <Button
                          data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                          onClick={() => props.handleSubmit()}
                          type="submit"
                        >
                          Continue
                        </Button>
                        <AvailableBalance
                          balance={formatMoney(balance)}
                          balanceTooltipLabel="Total balance minus any amounts already represented by transfer inscriptions in your wallet."
                        />
                      </ButtonRow>
                    }
                  >
                    <CardContent dataTestId={SendCryptoAssetSelectors.SendForm}>
                      <AmountField
                        balance={balance}
                        bottomInputOverlay={
                          <SendMaxButton
                            balance={balance}
                            sendMaxBalance={convertAmountToBaseUnit(balance).toString()}
                          />
                        }
                        autoComplete="off"
                        switchableAmount={
                          marketData ? (
                            <SendFiatValue
                              marketData={marketData}
                              assetSymbol={balance.symbol}
                              assetDecimals={balance.decimals}
                            />
                          ) : undefined
                        }
                      />
                      <SelectedAssetField
                        icon={<Brc20AvatarIcon />}
                        name={ticker}
                        symbol={ticker}
                      />
                      <Callout variant="info" title="Sending BRC-20 tokens requires two steps">
                        <styled.ol mb="space.02">
                          <li>1. Create transfer inscription with amount to send</li>
                          <li>2. Send transfer inscription to recipient of choice</li>
                        </styled.ol>
                        <Link
                          onClick={() => {
                            openInNewTab(
                              'https://leather.gitbook.io/guides/bitcoin/sending-brc-20-tokens'
                            );
                          }}
                          textStyle="body.02"
                        >
                          Learn more
                        </Link>
                      </Callout>
                    </CardContent>
                  </Card>

                  <Outlet />
                </Form>
              );
            }}
          </Formik>
        </Page>
      </Content>
    </>
  );
}

import { Outlet, useLocation } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Box, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { formatMoney } from '@app/common/money/format-money';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Brc20AvatarIcon } from '@app/ui/components/avatar/brc20-avatar-icon';
import { Button } from '@app/ui/components/button/button';
import { Callout } from '@app/ui/components/callout/callout';
import { AvailableBalance } from '@app/ui/components/containers/footers/available-balance';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Link } from '@app/ui/components/link/link';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendMaxButton } from '../../components/send-max-button';
import { defaultSendFormFormikProps } from '../../send-form.utils';
import { useBrc20SendForm } from './use-brc20-send-form';

function useBrc20SendFormRouteState() {
  const { state } = useLocation();
  return {
    balance: get(state, 'balance', '') as string,
    ticker: get(state, 'ticker', '') as string,
    decimals: get(state, 'decimals', '') as number,
    holderAddress: get(state, 'holderAddress', '') as string,
  };
}

export function Brc20SendForm() {
  const { balance, ticker, decimals, holderAddress } = useBrc20SendFormRouteState();
  const {
    initialValues,
    chooseTransactionFee,
    validationSchema,
    formRef,
    onFormStateChange,
    moneyBalance,
  } = useBrc20SendForm({ balance, ticker, decimals, holderAddress });

  return (
    <Box pb="space.04" width="100%">
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
                  <Footer variant="card">
                    <Button
                      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                      onClick={() => props.handleSubmit()}
                      type="submit"
                    >
                      Continue
                    </Button>
                    <AvailableBalance
                      balance={formatMoney(moneyBalance)}
                      balanceTooltipLabel="Total balance minus any amounts already represented by transfer inscriptions in your wallet."
                    />
                  </Footer>
                }
              >
                <CardContent dataTestId={SendCryptoAssetSelectors.SendForm}>
                  <AmountField
                    balance={moneyBalance}
                    bottomInputOverlay={
                      <SendMaxButton
                        balance={moneyBalance}
                        sendMaxBalance={moneyBalance.amount.toString()}
                      />
                    }
                    autoComplete="off"
                  />
                  <SelectedAssetField icon={<Brc20AvatarIcon />} name={ticker} symbol={ticker} />
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
    </Box>
  );
}

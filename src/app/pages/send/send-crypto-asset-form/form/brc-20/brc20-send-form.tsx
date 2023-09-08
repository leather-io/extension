import { Form, Outlet, useLocation } from 'react-router-dom';

import { Formik } from 'formik';
import { Box } from 'leather-styles/jsx';
import get from 'lodash.get';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Brc20TokenIcon } from '@app/components/icons/brc20-token-icon';
import { InfoLabel } from '@app/components/info-label';
import { Link } from '@app/components/link';

import { AmountField } from '../../components/amount-field';
import { FormFooter } from '../../components/form-footer';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendMaxButton } from '../../components/send-max-button';
import { defaultSendFormFormikProps } from '../../send-form.utils';
import { useBrc20SendForm } from './use-brc20-send-form';

function useBrc20SendFormRouteState() {
  const { state } = useLocation();
  return {
    balance: get(state, 'balance', '') as string,
    tick: get(state, 'tick', '') as string,
    decimals: get(state, 'decimals', '') as number,
  };
}

export function Brc20SendForm() {
  const { balance, tick, decimals } = useBrc20SendFormRouteState();
  const {
    initialValues,
    chooseTransactionFee,
    validationSchema,
    formRef,
    onFormStateChange,
    moneyBalance,
  } = useBrc20SendForm({ balance, tick, decimals });

  return (
    <Box width="100%" pb="space.04">
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
              <SendCryptoAssetFormLayout>
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
                <SelectedAssetField icon={<Brc20TokenIcon />} name={tick} symbol={tick} />
                <InfoLabel title="Sending BRC-20 tokens requires two steps">
                  {'1. Create transfer inscription with amount to send'}
                  <br />
                  {'2. Send transfer inscription to recipient of choice'}
                  <br /> <br />
                  <Link
                    fontSize={1}
                    fontWeight={500}
                    lineHeight="1.6"
                    onClick={() => {
                      openInNewTab(
                        'https://leather.gitbook.io/guides/bitcoin/sending-brc-20-tokens'
                      );
                    }}
                  >
                    {'Learn more'}
                  </Link>
                </InfoLabel>
              </SendCryptoAssetFormLayout>

              <FormFooter
                balance={moneyBalance}
                balanceTooltipLabel="Total balance minus any amounts already represented by transfer inscriptions in your wallet."
              />
              <Outlet />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

import { Form, Outlet, useLocation } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { Formik } from 'formik';
import get from 'lodash.get';

import { Brc20TokenIcon } from '@app/components/icons/brc20-token-icon';

import { AmountField } from '../../components/amount-field';
import { FormFooter } from '../../components/form-footer';
import { RecipientField } from '../../components/recipient-field';
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
  };
}

export function Brc20SendForm() {
  const { balance, tick } = useBrc20SendFormRouteState();
  const {
    initialValues,
    chooseTransactionFee,
    validationSchema,
    formRef,
    onFormStateChange,
    moneyBalance,
  } = useBrc20SendForm({ balance, tick });

  return (
    <Box width="100%" pb="base">
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
              {' '}
              <SendCryptoAssetFormLayout>
                <AmountField
                  balance={moneyBalance}
                  bottomInputOverlay={
                    <SendMaxButton balance={moneyBalance} sendMaxBalance={balance} />
                  }
                  autoComplete="off"
                />
                <SelectedAssetField icon={<Brc20TokenIcon />} name={tick} symbol={tick} />

                <RecipientField
                  labelAction=""
                  name="recipient"
                  placeholder="Enter recipient address"
                />
              </SendCryptoAssetFormLayout>
              <FormFooter balance={moneyBalance} />
              {/* <HighFeeDrawer learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} /> */}
              <Outlet />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

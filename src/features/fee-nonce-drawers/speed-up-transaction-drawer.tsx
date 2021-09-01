import React, { useCallback, useEffect } from 'react';
import { Box, Button, Spinner, Stack, Text } from '@stacks/ui';
import { ControlledDrawer } from '@components/drawer/controlled';
import { Caption } from '@components/typography';
import {
  useRawStacksTransactionByteSizeState,
  useRawStacksTransactionState,
  useRawTxIdState,
} from '@store/transactions/raw.hooks';
import { TxItem } from '@components/popup/tx-item';
import {
  useAccountSingleTransaction,
  useCurrentAccountAvailableStxBalance,
} from '@store/accounts/account.hooks';
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { useLoading } from '@common/hooks/use-loading';

import { FeeField } from '@features/fee-nonce-drawers/components/fee-field';
import { StacksTransaction } from '@stacks/transactions';
import { stacksValue, stxToMicroStx } from '@common/stacks-utils';
import {
  useFeeRate,
  useFeeRateMultiplier,
  useFeeRateMultiplierCustom,
  useFeeRateUseCustom,
  useReplaceByFeeSubmitCallBack,
} from '@store/transactions/fees.hooks';
import BigNumber from 'bignumber.js';
import { toast } from 'react-hot-toast';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { ErrorLabel } from '@components/error-label';
import { useFeeSchema } from './use-fee-schema';
import { microStxToStx } from '@stacks/ui-utils';

const useSelectedTx = () => {
  const [rawTxId] = useRawTxIdState();
  return useAccountSingleTransaction(rawTxId || undefined);
};

const Messaging = () => {
  return (
    <Caption>
      If your transaction has been pending for a long time, its fee might not be high enough to be
      included in a block. Increase the fee and try again.
    </Caption>
  );
};

const Balance = () => {
  const stxBalance = useCurrentAccountAvailableStxBalance();
  if (!stxBalance) return null;
  return <Caption>Balance: {stacksValue({ value: stxBalance, fixedDecimals: true })}</Caption>;
};

const Actions = ({ formikProps }: { formikProps: FormikProps<{ nonce: number; fee: number }> }) => {
  const { isLoading } = useLoading('speed');
  const [multiplierCustom] = useFeeRateMultiplierCustom();
  const [, setRawTxId] = useRawTxIdState();
  const rawTx = useRawStacksTransactionState();

  const oldFee = rawTx?.auth.spendingCondition?.fee.toNumber() || 0;
  const newFee = formikProps.values.fee;
  const isSame = !multiplierCustom && oldFee === newFee;

  return (
    <Stack isInline>
      <Button onClick={() => setRawTxId(null)} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button
        type="submit"
        flexGrow={1}
        onClick={formikProps.handleSubmit}
        isLoading={isLoading}
        borderRadius="10px"
        isDisabled={isSame}
      >
        Submit
      </Button>
    </Stack>
  );
};
const FormInner = ({
  formikProps,
}: {
  formikProps: FormikProps<{ nonce: number; fee: number }>;
}) => {
  const byteSize = useRawStacksTransactionByteSizeState();

  return (
    <Stack spacing="base">
      <FeeField byteSize={byteSize} />
      {formikProps.errors.fee && (
        <ErrorLabel mb="base">
          <Text textStyle="caption">{formikProps.errors.fee}</Text>
        </ErrorLabel>
      )}
      <Balance />
    </Stack>
  );
};

const getFeeNonceFromStacksTransaction = (tx?: StacksTransaction) => ({
  fee: tx?.auth.spendingCondition?.fee.toNumber() || 0,
  nonce: tx?.auth.spendingCondition?.nonce.toNumber() || 0,
});

const FeeForm = () => {
  const refreshAccountData = useRefreshAllAccountData();
  const [multiplier] = useFeeRateMultiplier();
  const [multiplierCustom] = useFeeRateMultiplierCustom();
  const [, setUseCustom] = useFeeRateUseCustom();
  const [, setFeeRate] = useFeeRate();
  const tx = useSelectedTx();
  const rawTx = useRawStacksTransactionState();
  const byteSize = useRawStacksTransactionByteSizeState();
  const [, setTxId] = useRawTxIdState();
  const { nonce, fee } = getFeeNonceFromStacksTransaction(rawTx);
  const schema = useFeeSchema();

  const handleSubmit = useReplaceByFeeSubmitCallBack();

  const onSubmit = useCallback(
    async values => {
      if (multiplierCustom !== multiplier) {
        setUseCustom(true);
      }
      if (!byteSize) return;
      // TODO: we should do some double checks that nothing changed before submitting
      await refreshAccountData();
      const newFeeRate = new BigNumber(stxToMicroStx(values.fee)).dividedBy(byteSize);
      const feeRate = newFeeRate.toNumber();
      setFeeRate(feeRate);
      await handleSubmit(values);
    },
    [
      byteSize,
      handleSubmit,
      multiplier,
      multiplierCustom,
      refreshAccountData,
      setFeeRate,
      setUseCustom,
    ]
  );

  useEffect(() => {
    if (tx?.tx_status !== 'pending' && rawTx) {
      setTxId(null);
      toast('Your transaction went through! No need to speed it up.');
    }
  }, [rawTx, tx?.tx_status, setTxId]);

  if (!tx || !rawTx) return null;

  return (
    <Formik
      initialValues={{ fee: new BigNumber(microStxToStx(fee)).toNumber(), nonce }}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({ fee: schema() })}
    >
      {formikProps => (
        <Stack spacing="extra-loose">
          {tx && <TxItem position="relative" zIndex={99} transaction={tx} />}
          <FormInner formikProps={formikProps} />
          <Actions formikProps={formikProps} />
        </Stack>
      )}
    </Formik>
  );
};

const Content = () => {
  return (
    <>
      <Messaging />
      <FeeForm />
    </>
  );
};

export const SpeedUpTransactionDrawer: React.FC = () => {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  return (
    <ControlledDrawer
      title="Increase transaction fee"
      isShowing={!!rawTxId}
      onClose={() => setRawTxId(null)}
    >
      <Stack px="loose" spacing="loose" pb="extra-loose">
        {rawTxId ? (
          <React.Suspense
            fallback={
              <Box p="extra-loose">
                <Spinner />
              </Box>
            }
          >
            <Content />
          </React.Suspense>
        ) : null}
      </Stack>
    </ControlledDrawer>
  );
};

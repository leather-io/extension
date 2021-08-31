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

import { FeeField } from '@features/tx-settings-drawer/components/fee-field';
import { StacksTransaction } from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import {
  useFeeRate,
  useFeeRateMultiplier,
  useFeeRateMultiplierCustom,
  useFeeRateUseCustom,
} from '@store/transactions/fees.hooks';
import { useSubmitTransactionCallback } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';
import { useAtomCallback } from 'jotai/utils';
import { rawSignedStacksTransactionState } from '@store/transactions/raw';
import BigNumber from 'bignumber.js';
import { toast } from 'react-hot-toast';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { stxAmountSchema } from '@common/validation/currency-schema';
import { STX_DECIMALS } from '@common/constants';
import { isNumber } from '@common/utils';
import { stxToMicroStx } from '@stacks/ui-utils';
import {
  formatInsufficientBalanceError,
  formatPrecisionError,
} from '@pages/send-tokens/hooks/use-send-form-validation';
import { ErrorLabel } from '@components/error-label';

const useSelectedTx = () => {
  const [rawTxId] = useRawTxIdState();
  return useAccountSingleTransaction(rawTxId || undefined);
};

const Messaging = () => {
  return (
    <Caption>
      If your transaction has been pending for a long time, its fee might not be high enough to be
      included in a block. To speed it up, increase the fee and send it again.
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
  return (
    <Stack spacing="base">
      <FeeField autoFocus value={formikProps.values.fee} />
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

const useFeeSchema = () => {
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  return useCallback(
    () =>
      stxAmountSchema(formatPrecisionError('STX', STX_DECIMALS)).test({
        message: formatInsufficientBalanceError(availableStxBalance, 'STX'),
        test(fee: unknown) {
          if (!availableStxBalance || !isNumber(fee)) return false;
          const availableBalanceLessFee = availableStxBalance.minus(fee);
          return availableBalanceLessFee.isGreaterThanOrEqualTo(stxToMicroStx(fee));
        },
      }),
    [availableStxBalance]
  );
};

const FeeForm = () => {
  const refreshAccountData = useRefreshAllAccountData();
  const [multiplier] = useFeeRateMultiplier();
  const [multiplierCustom, setMultiplier] = useFeeRateMultiplierCustom();
  const [, setUseCustom] = useFeeRateUseCustom();
  const [, setFeeRate] = useFeeRate();
  const tx = useSelectedTx();
  const rawTx = useRawStacksTransactionState();
  const byteSize = useRawStacksTransactionByteSizeState();
  const [, setTxId] = useRawTxIdState();
  const { nonce, fee } = getFeeNonceFromStacksTransaction(rawTx);
  const schema = useFeeSchema();
  const submitTransaction = useSubmitTransactionCallback({
    onClose: () => {
      setTxId(null);
      setUseCustom(false);
      setMultiplier(undefined);
      setFeeRate(undefined);
    },
    loadingKey: 'speed',
    replaceByFee: true,
  });

  const handleSubmit = useAtomCallback<void, { fee: number; nonce: number }>(
    useCallback(
      async get => {
        const signedTx = await get(rawSignedStacksTransactionState, true);
        if (!signedTx) return;
        await submitTransaction(signedTx);
      },
      [submitTransaction]
    )
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
      initialValues={{
        fee,
        nonce,
      }}
      onSubmit={async values => {
        if (multiplierCustom !== multiplier) {
          setUseCustom(true);
        }
        if (!byteSize) return;
        // TODO: we should do some double checks that nothing changed before submitting
        await refreshAccountData();
        const newFeeRate = new BigNumber(values.fee).dividedBy(byteSize);
        const feeRate = newFeeRate.toNumber();
        setFeeRate(feeRate);
        await handleSubmit(values);
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({
        fee: schema(),
      })}
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
      title="Speed up transaction"
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

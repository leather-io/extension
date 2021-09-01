import React, { Suspense, useEffect, useState } from 'react';

import { Button, Stack, Text } from '@stacks/ui';
import { ControlledDrawer } from '@components/drawer/controlled';
import { FeeField } from '@features/fee-nonce-drawers/components/fee-field';
import { NonceField } from '@features/fee-nonce-drawers/components/nonce-field';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { Caption } from '@components/typography';
import { useDrawers } from '@common/hooks/use-drawers';
import { useTxByteSizeState, useTxForSettingsState } from '@store/transactions/transaction.hooks';
import {
  useFeeRate,
  useFeeRateMultiplier,
  useFeeRateMultiplierCustom,
  useFeeRateUseCustom,
} from '@store/transactions/fees.hooks';
import { useCustomNonce } from '@store/transactions/nonce.hooks';
import { useLoading } from '@common/hooks/use-loading';
import BigNumber from 'bignumber.js';
import { useFeeSchema } from '@features/fee-nonce-drawers/use-fee-schema';
import { ErrorLabel } from '@components/error-label';
import { useLocalStxTransactionAmount } from '@store/transactions/local-transactions.hooks';
import { stxToMicroStx } from '@stacks/ui-utils';

const Messaging = () => {
  return (
    <Caption>
      Apply a higher fee to help your transaction confirm quickly, especially when the network is
      congested by other transactions.
    </Caption>
  );
};

const SuspenseOnMount = ({ onMountCallback, isEnabled }: any) => {
  const [tx] = useTxForSettingsState();
  useEffect(() => {
    if (tx && isEnabled) {
      onMountCallback();
    }
  }, [onMountCallback, isEnabled, tx]);

  return null;
};

const SettingsFormInner = ({
  formikProps,
}: {
  formikProps: FormikProps<{ nonce: number; fee: number }>;
}) => {
  const { isLoading } = useLoading('settings-form');
  const [transaction] = useTxForSettingsState();
  const fee = transaction?.auth.spendingCondition?.fee.toNumber();
  const nonce = transaction?.auth.spendingCondition?.nonce.toNumber();
  const { setShowTxSettings } = useDrawers();

  const { setFieldValue } = formikProps;

  useEffect(() => {
    setFieldValue('fee', fee);
    setFieldValue('nonce', nonce);
  }, [setFieldValue, fee, nonce]);

  return (
    <>
      <Stack>
        <FeeField value={formikProps.values.fee} />
        {formikProps.errors.fee && (
          <ErrorLabel mb="base">
            <Text textStyle="caption">{formikProps.errors.fee}</Text>
          </ErrorLabel>
        )}
        <NonceField value={formikProps.values.nonce} />
      </Stack>
      <Stack isInline>
        <Button
          onClick={() => setShowTxSettings(false)}
          flexGrow={1}
          borderRadius="10px"
          mode="tertiary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          flexGrow={1}
          onClick={formikProps.handleSubmit}
          isLoading={isLoading}
          borderRadius="10px"
        >
          Apply
        </Button>
      </Stack>
    </>
  );
};
const SettingsForm = () => {
  const [multiplier] = useFeeRateMultiplier();
  const [multiplierCustom] = useFeeRateMultiplierCustom();
  const [, setUseCustom] = useFeeRateUseCustom();
  const [, setFeeRate] = useFeeRate();
  const [, setCustomNonce] = useCustomNonce();
  const { setShowTxSettings } = useDrawers();
  const [byteSize] = useTxByteSizeState();
  const [isEnabled, setIsEnabled] = useState(false);
  const { setIsLoading, setIsIdle } = useLoading('settings-form');
  const [values, setValues] = useState({ fee: 0, nonce: 0 });
  const [amount] = useLocalStxTransactionAmount();
  const feeSchema = useFeeSchema(amount ? stxToMicroStx(amount) : undefined);

  return (
    <Formik
      initialValues={{ fee: 0, nonce: 0 }}
      onSubmit={values => {
        if (multiplierCustom !== multiplier) {
          setUseCustom(true);
        }
        if (!byteSize) return;
        const newFeeRate = new BigNumber(values.fee).dividedBy(byteSize);
        const feeRate = newFeeRate.toNumber();
        setValues({
          fee: values.fee,
          nonce: values.nonce,
        });
        setFeeRate(feeRate);
        setCustomNonce(values.nonce);
        setIsLoading();
        setTimeout(() => {
          setIsEnabled(true);
        }, 10);
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({
        fee: feeSchema(),
        nonce: yup.number().positive(),
      })}
    >
      {formikProps => (
        <>
          {isEnabled && (
            <Suspense fallback={<></>}>
              <SuspenseOnMount
                isEnabled={isEnabled}
                onMountCallback={() => {
                  setShowTxSettings(false);
                  setIsIdle();
                }}
              />
            </Suspense>
          )}
          <Suspense
            fallback={
              <>
                <Stack>
                  <FeeField value={values.fee} />
                  <NonceField value={values.nonce} />
                </Stack>
                <Stack isInline>
                  <Button flexGrow={1} borderRadius="10px" mode="tertiary">
                    Cancel
                  </Button>
                  <Button type="submit" flexGrow={1} isLoading borderRadius="10px">
                    Apply
                  </Button>
                </Stack>
              </>
            }
          >
            <SettingsFormInner formikProps={formikProps} />
          </Suspense>
        </>
      )}
    </Formik>
  );
};

export const TransactionSettingsDrawer: React.FC = () => {
  const { showTxSettings, setShowTxSettings } = useDrawers();
  const [, setFeeRateUseCustom] = useFeeRateUseCustom();
  const [, setFeeRateMultiplierCustom] = useFeeRateMultiplierCustom();
  return (
    <ControlledDrawer
      title="Advanced settings"
      isShowing={showTxSettings}
      onClose={() => {
        setShowTxSettings(false);
        setFeeRateUseCustom(false);
        setFeeRateMultiplierCustom(undefined);
      }}
    >
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <Messaging />
        {showTxSettings && <SettingsForm />}
      </Stack>
    </ControlledDrawer>
  );
};

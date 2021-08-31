import React, { Suspense, useEffect, useState } from 'react';

import { Button, Stack } from '@stacks/ui';
import { ControlledDrawer } from '@components/drawer/controlled';
import { FeeField } from '@features/tx-settings-drawer/components/fee-field';
import { NonceField } from '@features/tx-settings-drawer/components/nonce-field';
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
import { useLoading } from '@common/hooks/use-loading';
import BigNumber from 'bignumber.js';

const Messaging = () => {
  return (
    <Caption>
      If your transaction has been pending for a long time, its fee might not be high enough. To
      speed it up, increase the fees and send it again.
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
  const { setShowTxSettings } = useDrawers();
  const [byteSize] = useTxByteSizeState();
  const [isEnabled, setIsEnabled] = useState(false);
  const { setIsLoading, setIsIdle } = useLoading('settings-form');
  const [values, setValues] = useState({ fee: 0, nonce: 0 });

  return (
    <Formik
      initialValues={{
        fee: 0,
        nonce: 0,
      }}
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
        setIsLoading();
        setTimeout(() => {
          setIsEnabled(true);
        }, 10);
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={yup.object({
        fee: yup.number(),
        nonce: yup.number(),
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
  return (
    <ControlledDrawer
      title="Speed up transaction"
      isShowing={showTxSettings}
      onClose={() => setShowTxSettings(false)}
    >
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <Messaging />
        {showTxSettings && <SettingsForm />}
      </Stack>
    </ControlledDrawer>
  );
};

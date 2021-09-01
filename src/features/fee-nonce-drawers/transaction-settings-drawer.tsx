import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { Button, color, Stack } from '@stacks/ui';
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
import { LOADING_KEYS, useLoading } from '@common/hooks/use-loading';
import BigNumber from 'bignumber.js';
import { useFeeSchema } from '@features/fee-nonce-drawers/use-fee-schema';
import { useLocalStxTransactionAmount } from '@store/transactions/local-transactions.hooks';
import { Link } from '@components/link';
import { microStxToStx, stxToMicroStx } from '@stacks/ui-utils';
import { useShowEditNonceCleanupEffect, useShowEditNonceState } from '@store/ui/ui.hooks';
import { isValidUrl } from '@common/validation/validate-url';

const EditNonce = () => {
  const [showNonce, setShowNonce] = useShowEditNonceState();
  return !showNonce ? (
    <Caption
      pt="tight"
      _hover={{
        cursor: 'pointer',
        color: color('accent'),
      }}
      onClick={() => setShowNonce(true)}
    >
      Edit nonce
    </Caption>
  ) : (
    <NonceField />
  );
};

const Messaging = () => {
  const url = 'https://www.hiro.so/questions/transactions-advanced-settings';

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <>
      <Caption>
        Apply a higher fee to help your transaction confirm quickly, especially when the network is
        congested by other transactions.
      </Caption>
      <Link fontSize="14px" onClick={() => isValidUrl(url) && openInNewTab(url)}>
        Learn more...
      </Link>
    </>
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
  const { isLoading } = useLoading(LOADING_KEYS.TX_FEE_NONCE_DRAWER);
  const [transaction] = useTxForSettingsState();
  const fee = transaction?.auth.spendingCondition?.fee.toNumber();
  const nonce = transaction?.auth.spendingCondition?.nonce.toNumber();
  const { setShowTxSettings } = useDrawers();

  const [byteSize] = useTxByteSizeState();

  const { setFieldValue } = formikProps;

  useEffect(() => {
    if (fee) setFieldValue('fee', microStxToStx(fee).toString());
    setFieldValue('nonce', nonce);
  }, [setFieldValue, fee, nonce]);

  return (
    <>
      <Stack>
        {byteSize && <FeeField byteSize={byteSize} />}
        <EditNonce />
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

const SettingsForm = ({ onClose }: { onClose: () => void }) => {
  const [multiplier] = useFeeRateMultiplier();
  const [multiplierCustom] = useFeeRateMultiplierCustom();
  const [, setUseCustom] = useFeeRateUseCustom();
  const [, setFeeRate] = useFeeRate();
  const [, setCustomNonce] = useCustomNonce();
  const [byteSize] = useTxByteSizeState();
  const [isEnabled, setIsEnabled] = useState(false);
  const { setIsLoading } = useLoading(LOADING_KEYS.TX_FEE_NONCE_DRAWER);
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
        const newFeeRate = new BigNumber(stxToMicroStx(values.fee)).dividedBy(byteSize);
        const feeRate = newFeeRate.toNumber();
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
              <SuspenseOnMount isEnabled={isEnabled} onMountCallback={onClose} />
            </Suspense>
          )}
          <Suspense
            fallback={
              <>
                <Stack>
                  {byteSize && <FeeField byteSize={byteSize} />}
                  <EditNonce />
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
  const { isLoading, setIsIdle } = useLoading(LOADING_KEYS.TX_FEE_NONCE_DRAWER);

  useShowEditNonceCleanupEffect();

  const handleOnClose = useCallback(() => {
    setShowTxSettings(false);
    setFeeRateUseCustom(false);
    setFeeRateMultiplierCustom(undefined);
    if (isLoading) setIsIdle();
  }, [isLoading, setFeeRateMultiplierCustom, setFeeRateUseCustom, setIsIdle, setShowTxSettings]);

  return (
    <ControlledDrawer title="Advanced settings" isShowing={showTxSettings} onClose={handleOnClose}>
      <Stack px="loose" spacing="loose" pb="extra-loose">
        <Messaging />
        {showTxSettings && <SettingsForm onClose={handleOnClose} />}
      </Stack>
    </ControlledDrawer>
  );
};

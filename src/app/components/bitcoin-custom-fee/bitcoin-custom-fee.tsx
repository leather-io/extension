import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';
import * as yup from 'yup';

import type { BtcFeeType } from '@leather.io/models';
import { Button, Link } from '@leather.io/ui';

import type { TransferRecipient } from '@shared/models/form.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { OnChooseFeeArgs } from '../bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinCustomFeeInput } from './bitcoin-custom-fee-input';
import { useBitcoinCustomFee } from './hooks/use-bitcoin-custom-fee';

interface BitcoinCustomFeeProps {
  amount: number;
  customFeeInitialValue: string;
  hasInsufficientBalanceError: boolean;
  isSendingMax: boolean;
  onChooseFee({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType | null): void;
  onValidateBitcoinSpend(value: number): boolean;
  recipients: TransferRecipient[];
  setCustomFeeInitialValue: Dispatch<SetStateAction<string>>;
  maxCustomFeeRate: number;
}

export function BitcoinCustomFee({
  customFeeInitialValue,
  hasInsufficientBalanceError,
  isSendingMax,
  onChooseFee,
  onSetSelectedFeeType,
  onValidateBitcoinSpend,
  recipients,
  setCustomFeeInitialValue,
  maxCustomFeeRate,
}: BitcoinCustomFeeProps) {
  const feeInputRef = useRef<HTMLInputElement | null>(null);
  const getCustomFeeValues = useBitcoinCustomFee({
    isSendingMax,
    recipients,
  });

  const onChooseCustomBtcFee = useCallback(
    async ({ feeRate }: { feeRate: string }) => {
      onSetSelectedFeeType(null);
      const { fee: feeValue } = getCustomFeeValues(Number(feeRate));
      const isValid = onValidateBitcoinSpend(feeValue);
      if (!isValid) return;
      await onChooseFee({ feeRate: Number(feeRate), feeValue, time: '', isCustomFee: true });
    },
    [onSetSelectedFeeType, getCustomFeeValues, onValidateBitcoinSpend, onChooseFee]
  );

  const validationSchema = yup.object({
    feeRate: yup
      .number()
      .required('Fee is required')
      .integer('Fee must be a whole number')
      .test({
        message: 'Fee is too high',
        test: value => {
          return value <= maxCustomFeeRate;
        },
      }),
  });

  return (
    <Formik
      initialValues={{ feeRate: customFeeInitialValue.toString() }}
      onSubmit={onChooseCustomBtcFee}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {props => (
        <Form>
          <Stack gap="space.06" mt="space.02">
            <Stack gap="space.05">
              <styled.span color="ink.text-subdued" textStyle="body.02" maxWidth="21.5rem">
                Higher fee rates typically lead to faster confirmation times.
                <Link
                  ml="space.01"
                  onClick={() => openInNewTab('https://buybitcoinworldwide.com/fee-calculator/')}
                  textStyle="body.02"
                >
                  View fee calculator
                </Link>
              </styled.span>
              <BitcoinCustomFeeInput
                isSendingMax={isSendingMax}
                onClick={async () => {
                  feeInputRef.current?.focus();
                  await props.setValues({ ...props.values });
                }}
                customFeeInitialValue={customFeeInitialValue}
                setCustomFeeInitialValue={setCustomFeeInitialValue}
                recipients={recipients}
                hasInsufficientBalanceError={hasInsufficientBalanceError}
              />
            </Stack>
            <Button
              data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
              disabled={!props.values.feeRate}
              type="submit"
            >
              Use custom fee
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

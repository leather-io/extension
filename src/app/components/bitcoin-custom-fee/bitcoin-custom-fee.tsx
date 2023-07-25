import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { Stack, Text } from '@stacks/ui';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { PreviewButton } from '@app/components/preview-button';

import { OnChooseFeeArgs } from '../bitcoin-fees-list/bitcoin-fees-list';
import { TextInputField } from '../text-input-field';
import { BitcoinCustomFeeFiat } from './bitcoin-custom-fee-fiat';
import { useBitcoinCustomFee } from './hooks/use-bitcoin-custom-fee';

const feeInputLabel = 'sats/vB';

interface BitcoinCustomFeeProps {
  amount: number;
  customFeeInitialValue: string;
  hasInsufficientBalanceError: boolean;
  isSendingMax: boolean;
  onChooseFee({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs): Promise<void>;
  onSetSelectedFeeType(value: BtcFeeType | null): void;
  onValidateBitcoinSpend(value: number): boolean;
  recipient: string;
  setCustomFeeInitialValue: Dispatch<SetStateAction<string>>;
  maxCustomFeeRate: number;
}
export function BitcoinCustomFee({
  amount,
  customFeeInitialValue,
  hasInsufficientBalanceError,
  isSendingMax,
  onChooseFee,
  onSetSelectedFeeType,
  onValidateBitcoinSpend,
  recipient,
  setCustomFeeInitialValue,
  maxCustomFeeRate,
}: BitcoinCustomFeeProps) {
  const feeInputRef = useRef<HTMLInputElement | null>(null);
  const getCustomFeeValues = useBitcoinCustomFee({ amount, isSendingMax, recipient });

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
      {props => {
        return (
          <Form>
            <Stack spacing="extra-loose" mt="8px">
              <Stack spacing="loose">
                <Text fontSize="14px" lineHeight="20px" color="#74777D">
                  Higher fee rates typically lead to faster confirmation times.{' '}
                  <Link
                    _hover={{ textDecoration: 'none' }}
                    fontSize="14px"
                    mr="4px !important"
                    onClick={() => openInNewTab('https://buybitcoinworldwide.com/fee-calculator/')}
                  >
                    View fee calculator
                  </Link>
                </Text>
                <Stack spacing="extra-tight">
                  <TextInputField
                    hasError={hasInsufficientBalanceError}
                    label={feeInputLabel}
                    name="feeRate"
                    placeholder={feeInputLabel}
                    onClick={() => {
                      feeInputRef?.current?.focus();
                      props.setValues({ ...props.values });
                    }}
                    onChange={e => {
                      setCustomFeeInitialValue((e.target as HTMLInputElement).value);
                    }}
                    inputRef={feeInputRef}
                  />
                  <BitcoinCustomFeeFiat
                    amount={amount}
                    isSendingMax={isSendingMax}
                    recipient={recipient}
                  />
                </Stack>
              </Stack>

              <PreviewButton isDisabled={!props.values.feeRate} text="Use custom fee" />
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik, useField } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';
import * as yup from 'yup';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Button } from '@app/ui/components/button/button';
import { Input } from '@app/ui/components/input/input';
import { Link } from '@app/ui/components/link/link';

import { OnChooseFeeArgs } from '../bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinCustomFeeFiat } from './bitcoin-custom-fee-fiat';
import { useBitcoinCustomFee } from './hooks/use-bitcoin-custom-fee';

const feeInputLabel = 'sats/vB';

interface BitcoinCustomFeeInputProps {
  hasInsufficientBalanceError: boolean;
  onClick(): void;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
}
function BitcoinCustomFeeInput({
  hasInsufficientBalanceError,
  onClick,
  onChange,
}: BitcoinCustomFeeInputProps) {
  const [field] = useField('feeRate');
  return (
    <Input.Root hasError={hasInsufficientBalanceError}>
      <Input.Label>{feeInputLabel}</Input.Label>
      <Input.Field
        onClick={onClick}
        {...field}
        onChange={e => {
          field.onChange(e);
          onChange?.(e);
        }}
      />
    </Input.Root>
  );
}

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
  const getCustomFeeValues = useBitcoinCustomFee({
    amount: createMoney(amount, 'BTC'),
    isSendingMax,
    recipient,
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
                hasInsufficientBalanceError={hasInsufficientBalanceError}
                onClick={async () => {
                  feeInputRef?.current?.focus();
                  await props.setValues({ ...props.values });
                }}
                onChange={e => setCustomFeeInitialValue((e.target as HTMLInputElement).value)}
              />
              <Stack gap="space.01">
                <BitcoinCustomFeeFiat
                  amount={amount}
                  isSendingMax={isSendingMax}
                  recipient={recipient}
                />
              </Stack>
            </Stack>
            <Button
              data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
              disabled={!props.values.feeRate}
              onClick={() => props.handleSubmit}
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

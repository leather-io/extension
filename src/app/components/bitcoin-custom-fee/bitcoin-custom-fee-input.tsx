import { useState } from 'react';

import { useField } from 'formik';
import { Stack } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';
import type { RpcSendTransferRecipient } from '@shared/rpc/methods/send-transfer';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { satToBtc } from '@app/common/money/unit-conversion';
import { InsufficientFundsError } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { Input } from '@app/ui/components/input/input';

import { ErrorLabel } from '../error-label';
import { BitcoinCustomFeeFiat } from './bitcoin-custom-fee-fiat';
import {
  useBitcoinCustomFee,
  useBitcoinCustomFeeMultipleRecipients,
} from './hooks/use-bitcoin-custom-fee';

interface Props {
  onClick?(): void;
  amount: number;
  isSendingMax: boolean;
  recipient: string;
  hasInsufficientBalanceError: boolean;
  errorMessage?: string;
  setCustomFeeInitialValue?(value: string): void;
  customFeeInitialValue: string;
}

const feeInputLabel = 'sats/vB';

export function BitcoinCustomFeeInput({
  onClick,
  amount,
  isSendingMax,
  recipient,
  hasInsufficientBalanceError,
  setCustomFeeInitialValue,
  customFeeInitialValue,
}: Props) {
  const [field] = useField('feeRate');

  const [feeValue, setFeeValue] = useState<null | {
    fee: number;
    fiatFeeValue: string;
  }>(null);

  const getCustomFeeValues = useBitcoinCustomFee({
    amount: createMoney(amount, 'BTC'),
    isSendingMax,
    recipient,
  });
  const [unknownError, setUnknownError] = useState(false);
  const [customInsufficientBalanceError, setCustomInsufficientBalanceError] = useState(false);

  const hasError = hasInsufficientBalanceError || unknownError || customInsufficientBalanceError;
  const errorMessage =
    hasInsufficientBalanceError || customInsufficientBalanceError
      ? 'Insufficient funds'
      : 'Unknown error';

  function processFeeValue(feeRate: string) {
    try {
      const feeValues = getCustomFeeValues(Number(feeRate));
      setFeeValue(feeValues);

      setUnknownError(false);
      setCustomInsufficientBalanceError(false);
    } catch (err) {
      if (err instanceof InsufficientFundsError) {
        return setCustomInsufficientBalanceError(true);
      }

      setUnknownError(true);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCustomFeeInitialValue?.(e.target.value);
    processFeeValue(value);
  }

  useOnMount(() => {
    processFeeValue(customFeeInitialValue);
  });
  return (
    <Stack gap="space.05">
      <Stack>
        <Input.Root hasError={hasError}>
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
        {hasError && <ErrorLabel>{errorMessage}</ErrorLabel>}
      </Stack>

      {!hasError && feeValue && (
        <BitcoinCustomFeeFiat
          feeInBtc={satToBtc(feeValue.fee).toString()}
          fiatFeeValue={feeValue.fiatFeeValue}
        />
      )}
    </Stack>
  );
}

interface PropsMultipleRecipients {
  onClick?(): void;
  amount: number;
  isSendingMax: boolean;
  recipients: RpcSendTransferRecipient[];
  hasInsufficientBalanceError: boolean;
  errorMessage?: string;
  setCustomFeeInitialValue?(value: string): void;
  customFeeInitialValue: string;
}

export function BitcoinCustomFeeInputMultipleRecipients({
  onClick,
  amount,
  isSendingMax,
  recipients,
  hasInsufficientBalanceError,
  setCustomFeeInitialValue,
  customFeeInitialValue,
}: PropsMultipleRecipients) {
  const [field] = useField('feeRate');

  const [feeValue, setFeeValue] = useState<null | {
    fee: number;
    fiatFeeValue: string;
  }>(null);

  const getCustomFeeValues = useBitcoinCustomFeeMultipleRecipients({
    amount: createMoney(amount, 'BTC'),
    isSendingMax,
    recipients,
  });
  const [unknownError, setUnknownError] = useState(false);
  const [customInsufficientBalanceError, setCustomInsufficientBalanceError] = useState(false);

  const hasError = hasInsufficientBalanceError || unknownError || customInsufficientBalanceError;
  const errorMessage =
    hasInsufficientBalanceError || customInsufficientBalanceError
      ? 'Insufficient funds'
      : 'Unknown error';

  function processFeeValue(feeRate: string) {
    try {
      const feeValues = getCustomFeeValues(Number(feeRate));
      setFeeValue(feeValues);

      setUnknownError(false);
      setCustomInsufficientBalanceError(false);
    } catch (err) {
      if (err instanceof InsufficientFundsError) {
        return setCustomInsufficientBalanceError(true);
      }

      setUnknownError(true);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCustomFeeInitialValue?.(e.target.value);
    processFeeValue(value);
  }

  useOnMount(() => {
    processFeeValue(customFeeInitialValue);
  });
  return (
    <Stack gap="space.05">
      <Stack>
        <Input.Root hasError={hasError}>
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
        {hasError && <ErrorLabel>{errorMessage}</ErrorLabel>}
      </Stack>

      {!hasError && feeValue && (
        <BitcoinCustomFeeFiat
          feeInBtc={satToBtc(feeValue.fee).toString()}
          fiatFeeValue={feeValue.fiatFeeValue}
        />
      )}
    </Stack>
  );
}

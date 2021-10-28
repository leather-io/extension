import React, { useCallback, useMemo, useState } from 'react';
import { useField } from 'formik';
import { Button, Input, InputGroup, Stack, StackProps, ButtonProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import { useFeeRate } from '@store/transactions/fees.hooks';
import { microStxToStx, stxToMicroStx } from '@stacks/ui-utils';
import { SendFormErrorMessages } from '@common/error-messages';
import { ConfirmTransferSelectors } from '@tests/page-objects/confirm-transfer-selectors';

const multipliers = [2, 5, 10];

interface MultiplierButtonProps extends ButtonProps {
  multiplier: number;
}
const MultiplierButton = ({ multiplier, ...rest }: MultiplierButtonProps) => (
  <Button
    type="button"
    size="sm"
    mode="tertiary"
    borderRadius="6px"
    key={`multiply-${multiplier}`}
    {...rest}
    data-testid={(ConfirmTransferSelectors as any)[`BtnMultiplier${multiplier}x`]}
  >
    {multiplier}x
  </Button>
);

interface FeeMultiplierInputsProps extends StackProps {
  showReset?: boolean;
  onSelectMultiplier(multiplier: number): void;
}
const FeeMultiplierInputs = (props: FeeMultiplierInputsProps) => {
  const { onSelectMultiplier, showReset, ...rest } = props;

  return (
    <Stack alignItems="center" isInline {...rest}>
      {showReset && (
        <MultiplierButton multiplier={1} key={`multiply-1`} onClick={() => onSelectMultiplier(1)} />
      )}
      {multipliers.map(multiplier => (
        <MultiplierButton
          multiplier={multiplier}
          onClick={() => onSelectMultiplier(multiplier)}
          key={`multiply-${multiplier}`}
        />
      ))}
    </Stack>
  );
};

interface FeeField extends StackProps {
  byteSize: number;
}
export const FeeField = ({ byteSize, ...props }: FeeField) => {
  const [field, meta, helpers] = useField('fee');

  const [feeRate] = useFeeRate();

  const [modified, setModified] = useState(false);

  const showResetMultiplier = useMemo(() => {
    if (modified) return true;
    if (!byteSize) return false;
    return stxToMicroStx(field.value) !== feeRate * byteSize;
  }, [modified, byteSize, field.value, feeRate]);

  const onSelectMultiplier = useCallback(
    (multiplier: number) => {
      if (!byteSize) return;
      setModified(multiplier !== 1);
      helpers.setValue(microStxToStx(byteSize * feeRate * multiplier));
    },
    [byteSize, feeRate, helpers]
  );

  const fieldError = useMemo(() => {
    switch (meta.error) {
      case SendFormErrorMessages.AdjustedFeeExceedsBalance:
        return (
          <>
            The fee added now exceeds your current STX balance. Consider lowering the amount being
            sent.
          </>
        );
      default:
        return meta.error;
    }
  }, [meta.error]);

  return (
    <>
      <Stack width="100%" position="relative" {...props}>
        <FeeMultiplierInputs
          pt="base-loose"
          pr="base-tight"
          height="100%"
          top="0"
          right={0}
          zIndex={99}
          position="absolute"
          showReset={showResetMultiplier}
          onSelectMultiplier={onSelectMultiplier}
        />
        <InputGroup flexDirection="column">
          <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="fee">
            Fee
          </Text>
          <Input
            display="block"
            type="number"
            width="100%"
            placeholder="Enter a custom fee"
            autoComplete="off"
            data-testid={ConfirmTransferSelectors.InputCustomFee}
            {...field}
          />
        </InputGroup>
      </Stack>
      {meta.error && (
        <ErrorLabel data-testid={ConfirmTransferSelectors.InputCustomFeeError}>
          <Text textStyle="caption" lineHeight="18px">
            {fieldError}
          </Text>
        </ErrorLabel>
      )}
    </>
  );
};

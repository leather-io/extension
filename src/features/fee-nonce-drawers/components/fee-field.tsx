import React, { memo } from 'react';
import { useFormikContext } from 'formik';
import { Button, color, Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import { useFeeRateMultiplier, useFeeRateMultiplierCustom } from '@store/transactions/fees.hooks';
import { microStxToStx, stxToMicroStx } from '@stacks/ui-utils';

interface FieldProps extends StackProps {
  value: number;
  error?: string;
  autoFocus?: boolean;
}

const multipliers = [2, 5, 10];

const MultiplierButton = ({ multiplier, current, ...rest }: any) => (
  <Button
    size="sm"
    mode="tertiary"
    borderRadius="6px"
    borderColor={multiplier === current ? color('accent') : color('border')}
    key={`multiply-${multiplier}`}
    {...rest}
  >
    {multiplier}x
  </Button>
);

const Multipliers = (props: StackProps) => {
  const [current, update] = useFeeRateMultiplierCustom();

  return (
    <Stack alignItems="center" isInline {...props}>
      {current && (
        <MultiplierButton
          multiplier={1}
          current={current}
          onClick={() => {
            update(undefined);
          }}
          key={`multiply-1`}
        >
          x
        </MultiplierButton>
      )}
      {multipliers.map(multiplier => (
        <MultiplierButton
          multiplier={multiplier}
          current={current}
          onClick={() => {
            update(multiplier);
          }}
          key={`multiply-${multiplier}`}
        >
          {multiplier}x
        </MultiplierButton>
      ))}
    </Stack>
  );
};

export const FeeField = memo(({ value, error, autoFocus, ...props }: FieldProps) => {
  const { setFieldValue } = useFormikContext();
  const [multiplier] = useFeeRateMultiplier();
  const [multiplierCustom] = useFeeRateMultiplierCustom();
  const factor = multiplierCustom === multiplier ? 1 : multiplierCustom || multiplier;

  const getFeeValue = (v: number) => factor * v;
  const formattedValue = microStxToStx(getFeeValue(value)) as number;

  return (
    <Stack width="100%" {...props} position="relative">
      <Multipliers
        pt="base-loose"
        pr="base-tight"
        height="100%"
        top="0"
        right={0}
        zIndex={99}
        position="absolute"
      />
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="fee">
          Fee
        </Text>
        <Input
          display="block"
          type="number"
          width="100%"
          name="fee"
          value={formattedValue}
          onChange={e => {
            const value = e.currentTarget.value;
            setFieldValue('fee', stxToMicroStx(value));
          }}
          placeholder="Enter a custom fee"
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </InputGroup>
      {error && (
        <ErrorLabel>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});

import React from 'react';
import { useField } from 'formik';
import { Button, Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import { useFeeRate } from '@store/transactions/fees.hooks';
import { microStxToStx } from '@stacks/ui-utils';
import { useTxByteSizeState } from '@store/transactions/transaction.hooks';

const multipliers = [2, 5, 10];

const MultiplierButton = ({ multiplier, ...rest }: any) => (
  <Button size="sm" mode="tertiary" borderRadius="6px" key={`multiply-${multiplier}`} {...rest}>
    {multiplier}x
  </Button>
);

interface MultipliersProps extends StackProps {
  onSelectMultiplier(multiplier: number): void;
}
const Multipliers = ({ onSelectMultiplier, ...props }: MultipliersProps) => {
  return (
    <Stack alignItems="center" isInline {...props}>
      <MultiplierButton multiplier={1} key={`multiply-1`} onClick={() => onSelectMultiplier(1)}>
        x
      </MultiplierButton>
      {multipliers.map(multiplier => (
        <MultiplierButton
          multiplier={multiplier}
          onClick={() => onSelectMultiplier(multiplier)}
          key={`multiply-${multiplier}`}
        >
          {multiplier}x
        </MultiplierButton>
      ))}
    </Stack>
  );
};

export const FeeField = () => {
  const [field, meta, helpers] = useField('fee');
  const [byteSize] = useTxByteSizeState();
  const [feeRate] = useFeeRate();

  return (
    <Stack width="100%" position="relative">
      <Multipliers
        pt="base-loose"
        pr="base-tight"
        height="100%"
        top="0"
        right={0}
        zIndex={99}
        position="absolute"
        onSelectMultiplier={multiplier => {
          if (!byteSize) return;
          helpers.setValue(microStxToStx(feeRate * byteSize * multiplier));
        }}
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
          {...field}
        />
      </InputGroup>
      {meta.error && (
        <ErrorLabel>
          <Text textStyle="caption">{meta.error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
};

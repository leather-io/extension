import React, { memo } from 'react';
import { useFormikContext } from 'formik';
import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';

interface FieldProps extends StackProps {
  value: number;
  error?: string;
}
// TODO: this should use a new "Field" component (with inline label like in figma)
export const NonceField = memo(({ value, error, ...props }: FieldProps) => {
  const { handleChange } = useFormikContext();

  return (
    <Stack width="100%" {...props}>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="nonce">
          Nonce
        </Text>
        <Input
          display="block"
          type="number"
          width="100%"
          name="nonce"
          value={value}
          onChange={handleChange}
          placeholder="Enter a custom nonce"
          autoComplete="off"
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

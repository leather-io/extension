import { FormEvent, memo } from 'react';
import { useField } from 'formik';
import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@app/components/error-label';

interface EditNonceFieldProps extends StackProps {
  onBlur?(): void;
}
export const EditNonceField = memo((props: EditNonceFieldProps) => {
  const { onBlur } = props;
  const [field, meta, helpers] = useField('nonce');

  return (
    <Stack width="100%" {...props}>
      <InputGroup flexDirection="column">
        <Input
          autoComplete="off"
          display="block"
          name="nonce"
          onBlur={onBlur}
          onChange={(evt: FormEvent<HTMLInputElement>) => {
            helpers.setValue(evt.currentTarget.value);
          }}
          placeholder="Enter a custom nonce"
          type="number"
          value={field.value}
          width="100%"
        />
      </InputGroup>
      {meta.error && (
        <ErrorLabel>
          <Text textStyle="caption">{meta.error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});

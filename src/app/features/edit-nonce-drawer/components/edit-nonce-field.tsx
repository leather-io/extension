import { FormEvent, memo } from 'react';

import { useField } from 'formik';
import { Stack, StackProps } from 'leather-styles/jsx';

import { ErrorLabel } from '@app/components/error-label';
import { Input } from '@app/ui/components/input';

interface EditNonceFieldProps extends StackProps {
  onBlur(): void;
}
export const EditNonceField = memo((props: EditNonceFieldProps) => {
  const { onBlur } = props;
  const [field, meta, helpers] = useField('nonce');

  return (
    <Stack width="100%" {...props}>
      <Input
        onBlur={onBlur}
        onChange={async (evt: FormEvent<HTMLInputElement>) => {
          await helpers.setValue(evt.currentTarget.value);
        }}
        placeholder="Enter a custom nonce"
        value={field.value}
      />
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
    </Stack>
  );
});

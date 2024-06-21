import { FormEvent, memo } from 'react';

import { useField } from 'formik';
import { Stack, StackProps } from 'leather-styles/jsx';

import { Input } from '@leather.io/ui';

import { ErrorLabel } from '@app/components/error-label';

interface EditNonceFieldProps extends StackProps {
  onBlur(): void;
}
export const EditNonceField = memo((props: EditNonceFieldProps) => {
  const { onBlur } = props;
  const [field, meta, helpers] = useField('nonce');

  return (
    <Stack width="100%" {...props}>
      <Input.Root data-has-error={meta.error}>
        <Input.Label>Custom nonce</Input.Label>
        <Input.Field
          onBlur={onBlur}
          value={field.value}
          onChange={async (evt: FormEvent<HTMLInputElement>) => {
            await helpers.setValue(evt.currentTarget.value);
          }}
        />
      </Input.Root>
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
    </Stack>
  );
});

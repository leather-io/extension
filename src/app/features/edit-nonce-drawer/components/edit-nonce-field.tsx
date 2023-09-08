import { FormEvent, memo } from 'react';

// #4164 FIXME migrate Input
import { Input } from '@stacks/ui';
import { useField } from 'formik';
import { Stack, StackProps, styled } from 'leather-styles/jsx';

import { ErrorLabel } from '@app/components/error-label';

interface EditNonceFieldProps extends StackProps {
  onBlur(): void;
}
export const EditNonceField = memo((props: EditNonceFieldProps) => {
  const { onBlur } = props;
  const [field, meta, helpers] = useField('nonce');

  return (
    <Stack width="100%" {...props}>
      <Input
        autoComplete="off"
        display="block"
        name="nonce"
        onBlur={onBlur}
        onChange={async (evt: FormEvent<HTMLInputElement>) => {
          await helpers.setValue(evt.currentTarget.value);
        }}
        placeholder="Enter a custom nonce"
        type="number"
        value={field.value}
        width="100%"
      />
      {meta.error && (
        <ErrorLabel>
          <styled.span textStyle="caption.02">{meta.error}</styled.span>
        </ErrorLabel>
      )}
    </Stack>
  );
});

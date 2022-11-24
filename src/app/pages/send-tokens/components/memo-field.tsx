import { memo } from 'react';

import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

interface FieldProps extends StackProps {
  value: string;
  error?: string;
}
// TODO: this should use a new "Field" component (with inline label like in figma)
export const MemoField = memo(({ value, error, ...props }: FieldProps) => {
  const { handleChange } = useFormikContext();

  return (
    <Stack width="100%" {...props}>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="memo">
          Memo
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="memo"
          value={value}
          onChange={handleChange}
          placeholder="Enter an message (optional)"
          autoComplete="off"
          data-testid={SendFormSelectors.InputMemoField}
        />
      </InputGroup>
      {error && (
        <ErrorLabel data-testid={SendFormSelectors.InputMemoFieldErrorLabel}>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});

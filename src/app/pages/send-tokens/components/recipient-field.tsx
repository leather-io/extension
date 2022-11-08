import { memo } from 'react';

import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

interface RecipientField extends StackProps {
  error?: string;
  value: string;
}

// TODO: this should use a new "Field" component (with inline label like in figma)
function RecipientFieldBase(props: RecipientField) {
  const { error, value, ...rest } = props;
  const { handleChange } = useFormikContext();

  return (
    <Stack width="100%" {...rest}>
      <InputGroup flexDirection="column">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="recipient"
        >
          Recipient
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="recipient"
          value={value}
          onChange={handleChange}
          placeholder="Enter an address"
          autoComplete="off"
          data-testid={SendFormSelectors.InputRecipientField}
        />
      </InputGroup>
      {error && (
        <ErrorLabel data-testid={SendFormSelectors.InputRecipientFieldErrorLabel}>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
}

export const RecipientField = memo(RecipientFieldBase);

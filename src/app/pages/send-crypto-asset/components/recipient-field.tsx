import { Flex, Input, Text, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useField } from 'formik';

// TODO: How do we want to handle bns name in the new form design?
interface RecipientFieldProps {}
export function RecipientField({}: RecipientFieldProps) {
  const [field] = useField('recipient');

  return (
    <Flex as="label" htmlFor="recipient" flexDirection="column" p="base" py="loose">
      <Text color={color('text-caption')} fontSize={0} mb="2px">
        To
      </Text>
      <Input
        _focus={{ border: 'none' }}
        id="recipient"
        autoComplete="off"
        border="none"
        data-testid={SendFormSelectors.InputRecipientField}
        display="block"
        fontSize={2}
        height="24px"
        p="none"
        type="input"
        width="100%"
        placeholder="Address or name"
        {...field}
      />
    </Flex>
  );
}
// border="1px solid red"

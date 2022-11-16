import { Flex, Input, Text, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useField } from 'formik';

interface MemoFieldProps {}
export function MemoField({}: MemoFieldProps) {
  const [field] = useField('memo');

  return (
    <Flex flexDirection="column" px="base">
      <Text color={color('text-caption')} fontSize={0} mb="2px">
        Memo
      </Text>
      <Input
        _focus={{ border: 'none' }}
        autoComplete="off"
        border="none"
        data-testid={SendFormSelectors.InputMemoField}
        display="block"
        fontSize={2}
        height="24px"
        p="none"
        type="string"
        width="100%"
        placeholder="Optional message"
        {...field}
      />
    </Flex>
  );
}

import { Flex } from '@stacks/ui';

import { DividerSeparator } from '@app/components/layout/divider-separator';

interface FormFieldsProps {
  children: React.ReactNode;
}
export function FormFieldsLayout({ children }: FormFieldsProps) {
  return (
    <Flex
      border="1px solid"
      borderColor="#DCDDE2"
      borderRadius="10px"
      flexDirection="column"
      mt="loose"
      width="100%"
    >
      <DividerSeparator>{children}</DividerSeparator>
    </Flex>
  );
}

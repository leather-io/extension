import { Flex } from '@stacks/ui';

interface FormFieldsProps {
  children: React.ReactNode;
}
export function FormFieldsLayout({ children }: FormFieldsProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      maxHeight={['calc(100vh - 116px)', 'calc(85vh - 116px)']}
      overflowY="scroll"
      pb={['92px', 'unset']}
      pt={['base', '48px']}
      px="loose"
    >
      {children}
    </Flex>
  );
}

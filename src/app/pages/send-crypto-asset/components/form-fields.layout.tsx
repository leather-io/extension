import { Flex } from '@stacks/ui';

import { DividerSeparator } from '@app/components/divider-separator';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

interface FormFieldsProps {
  children: React.ReactNode;
}
export function FormFieldsLayout({ children }: FormFieldsProps) {
  return (
    <Flex
      border="1px solid"
      borderColor="#DCDDE2"
      borderRadius="16px"
      flexDirection="column"
      mt="loose"
      minWidth={['344px', CENTERED_FULL_PAGE_MAX_WIDTH]}
    >
      <DividerSeparator>{children}</DividerSeparator>
    </Flex>
  );
}

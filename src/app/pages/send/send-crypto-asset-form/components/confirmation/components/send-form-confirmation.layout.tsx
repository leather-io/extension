import { Flex, StackProps } from '@stacks/ui';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

export function SendFormConfirmationLayout({ children }: StackProps) {
  return (
    <Flex
      alignItems="center"
      flexGrow={1}
      flexDirection="column"
      justifyContent="start"
      maxWidth={['unset', 'unset', CENTERED_FULL_PAGE_MAX_WIDTH]}
      mt={['36px', '36px', '48px']}
      pb="extra-loose"
      px="loose"
    >
      {children}
    </Flex>
  );
}

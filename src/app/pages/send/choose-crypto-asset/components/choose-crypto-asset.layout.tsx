import { Flex, StackProps } from '@stacks/ui';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { PageTitle } from '@app/components/page-title';

export function ChooseCryptoAssetLayout({ children }: StackProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      justifyContent="start"
      maxHeight={['unset', '85vh']}
      overflowY="auto"
    >
      <PageTitle
        fontSize={3}
        maxWidth={['unset', 'unset', CENTERED_FULL_PAGE_MAX_WIDTH]}
        mb={['loose', 'loose', '48px']}
        mt={['unset', 'loose']}
        px="loose"
        textAlign={['left', 'center']}
      >
        Choose asset
      </PageTitle>
      {children}
    </Flex>
  );
}

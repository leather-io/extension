import { Flex, StackProps } from '@stacks/ui';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { PageTitle } from '@app/components/page-title';

export function SendCryptoAssetLayout({ children }: StackProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent="start"
      mb="loose"
    >
      <PageTitle
        fontSize={3}
        maxWidth={['unset', 'unset', CENTERED_FULL_PAGE_MAX_WIDTH]}
        mb={['loose', 'loose', '48px']}
        px="loose"
        textAlign={['left', 'center']}
      >
        Choose asset
      </PageTitle>
      {children}
    </Flex>
  );
}

import { Flex } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

export function SwapContainerLayout({ children }: HasChildren) {
  return (
    <Flex
      maxHeight="90vh"
      border={['unset', '1px solid']}
      borderRadius={['unset', '16px']}
      borderColor={['unset', '#DCDDE2']}
      maxWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
      minWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
    >
      {children}
    </Flex>
  );
}

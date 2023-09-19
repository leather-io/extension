import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function SwapContainerLayout({ children }: HasChildren) {
  return whenPageMode({
    full: (
      <Flex
        borderRadius={['unset', '16px']}
        maxHeight="90vh"
        maxWidth={['100%', 'centeredPageFullWidth']}
        minWidth={['100%', 'centeredPageFullWidth']}
        background="accent.background-primary"
      >
        {children}
      </Flex>
    ),
    popup: (
      <Flex background="accent.background-primary" width="100%">
        {children}
      </Flex>
    ),
  });
}

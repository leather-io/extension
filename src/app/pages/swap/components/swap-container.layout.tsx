import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function SwapContainerLayout({ children }: HasChildren) {
  return (
    <Flex
      maxHeight="90vh"
      border={['unset', '1px solid']}
      borderRadius={['unset', '16px']}
      borderColor={['unset', '#DCDDE2']}
      maxWidth={['100%', 'centredPageFullWidth']}
      minWidth={['100%', 'centredPageFullWidth']}
    >
      {children}
    </Flex>
  );
}

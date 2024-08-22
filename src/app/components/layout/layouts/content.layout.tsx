import { Flex } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

export function Content({ children }: HasChildren) {
  return (
    <Flex
      className="main-content"
      flexGrow={1}
      position="relative"
      width="100%"
      maxWidth="fullPageMaxWidth"
    >
      {children}
    </Flex>
  );
}

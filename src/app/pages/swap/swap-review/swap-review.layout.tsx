import { Flex } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function SwapReviewLayout({ children }: HasChildren) {
  return (
    <Flex alignItems="center" flexDirection="column" justifyItems="center" width="100%">
      {children}
    </Flex>
  );
}

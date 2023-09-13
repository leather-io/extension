import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function SwapSummaryLayout({ children }: HasChildren) {
  return (
    <Flex alignItems="center" flexDirection="column" justifyItems="center" width="100%">
      {children}
    </Flex>
  );
}

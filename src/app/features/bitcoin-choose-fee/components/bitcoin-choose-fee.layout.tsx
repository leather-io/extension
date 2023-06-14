import { Flex } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function BitcoinChooseFeeLayout({ children }: HasChildren) {
  return (
    <Flex alignItems="center" p="extra-loose" spacing="base" width="100%">
      {children}
    </Flex>
  );
}

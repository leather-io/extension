import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function SwapFooterLayout({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      bg={whenPageMode({
        full: '',
        popup: 'accent.background-primary',
      })}
      bottom="0"
      justifyContent="center"
      p="space.05"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
      width="100%"
      zIndex={999}
    >
      {children}
    </Flex>
  );
}

import { Flex } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function SwapFooterLayout({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      bg={whenPageMode({
        full: '',
        popup: '#fff',
      })}
      bottom="0"
      borderTop="1px solid #EFEFF2"
      justifyContent="center"
      p="loose"
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

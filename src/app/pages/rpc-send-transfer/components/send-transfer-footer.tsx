import { color } from '@stacks/ui';
import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function SendTransferFooter({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      bg={whenPageMode({
        full: 'unset',
        popup: color('bg'), // 4383 FIXME - colour
      })}
      borderTop="1px solid #EFEFF2" // 4383  FIXME - use token
      bottom="0"
      justifyContent="center"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
      px="space.06"
      py="space.05"
      width="100%"
      zIndex={999}
    >
      {children}
    </Flex>
  );
}

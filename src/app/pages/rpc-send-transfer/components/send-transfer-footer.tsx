import { Flex, color } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function SendTransferFooter({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      bg={whenPageMode({
        full: 'unset',
        popup: color('bg'),
      })}
      borderTop="1px solid #EFEFF2"
      bottom="0"
      justifyContent="center"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
      px="extra-loose"
      py="loose"
      width="100%"
      zIndex={999}
    >
      {children}
    </Flex>
  );
}

import { Outlet } from 'react-router-dom';

import { Flex, color } from '@stacks/ui';

import { whenPageMode } from '@app/common/utils';

export function SendContainer() {
  return whenPageMode({
    full: (
      <Flex
        alignItems="start"
        borderWidth="1px"
        borderColor={color('border')}
        borderRadius="16px"
        justifyContent="center"
        maxHeight="90vh"
        minWidth="480px"
        pb="loose"
      >
        <Outlet />
      </Flex>
    ),
    popup: <Outlet />,
  });
}

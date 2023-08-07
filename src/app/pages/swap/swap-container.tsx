import { Outlet } from 'react-router-dom';

import { Flex } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { whenPageMode } from '@app/common/utils';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { ModalHeader } from '@app/components/modal-header';

export function SwapContainer() {
  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  return whenPageMode({
    full: (
      <Flex
        maxHeight="90vh"
        border={['unset', '1px solid']}
        borderRadius={['unset', '16px']}
        borderColor={['unset', '#DCDDE2']}
        maxWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
        minWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
      >
        <Outlet />
      </Flex>
    ),
    popup: <Outlet />,
  });
}

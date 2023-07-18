import { Outlet } from 'react-router-dom';

import { Flex } from '@stacks/ui';

import { whenPageMode } from '@app/common/utils';
import { ModalHeader } from '@app/components/modal-header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

export function SwapContainer() {
  useRouteHeader(<ModalHeader hideActions defaultGoBack title="Swap" />, true);

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

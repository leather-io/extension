import { Outlet } from 'react-router-dom';

import { Flex } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { whenPageMode } from '@app/common/utils';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { ModalHeader } from '@app/components/modal-header';

export function SendContainer() {
  useRouteHeader(<ModalHeader hideActions defaultGoBack title="Send" />, true);

  return whenPageMode({
    full: (
      <Flex
        border={['unset', '1px solid']}
        borderColor={['unset', '#DCDDE2']}
        borderRadius={['unset', '16px']}
        maxHeight="90vh"
        maxWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
        minWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
      >
        <Outlet />
      </Flex>
    ),
    popup: <Outlet />,
  });
}

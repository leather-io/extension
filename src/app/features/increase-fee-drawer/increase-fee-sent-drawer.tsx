import { FiCheck } from 'react-icons/fi';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

export function IncreaseFeeSentDrawer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isShowing = location.pathname === RouteUrls.IncreaseFeeSent;

  return (
    <>
      <BaseDrawer isShowing={isShowing} onClose={() => navigate(RouteUrls.Home)} title="Confirmed">
        <Flex px="loose" pb="extra-loose" justifyContent="center">
          <Box size="32px" as={FiCheck} mt="2px" />
        </Flex>
      </BaseDrawer>
      <Outlet />
    </>
  );
}

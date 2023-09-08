import { FiCheck } from 'react-icons/fi';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

export function IncreaseFeeSentDrawer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isShowing = location.pathname === RouteUrls.IncreaseFeeSent;

  return (
    <>
      <BaseDrawer isShowing={isShowing} onClose={() => navigate(RouteUrls.Home)} title="Confirmed">
        <Flex px="space.05" pb="space.06" justifyContent="center">
          {/* TODO - check if this needs a color wrapper */}
          <FiCheck size="32px" style={{ marginTop: '2px' }} />
        </Flex>
      </BaseDrawer>
      <Outlet />
    </>
  );
}

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';

export function IncreaseFeeSentDrawer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isShowing = location.pathname === RouteUrls.IncreaseFeeSent;

  return (
    <>
      <BaseDrawer isShowing={isShowing} onClose={() => navigate(RouteUrls.Home)} title="Confirmed">
        <Flex justifyContent="center" pb="space.06" px="space.05">
          <CheckmarkIcon mt="2px" size="lg" />
        </Flex>
      </BaseDrawer>
      <Outlet />
    </>
  );
}

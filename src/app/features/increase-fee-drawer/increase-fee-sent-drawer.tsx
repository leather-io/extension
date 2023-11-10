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
        <Flex px="loose" pb="extra-loose" justifyContent="center">
          {/* TODO 
          - check this as icon was 32px not 24px  
          - make sure FiCheck =CheckmarkIcon
           */}
          <CheckmarkIcon size="icon.lg" mt="2px" />
        </Flex>
      </BaseDrawer>
      <Outlet />
    </>
  );
}

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';
import { CheckmarkIcon } from '@app/ui/icons/checkmark-icon';

export function IncreaseFeeSentDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const isShowing = location.pathname === RouteUrls.IncreaseFeeSent;

  return (
    <>
      <Dialog
        isShowing={isShowing}
        onClose={() => navigate(RouteUrls.Home)}
        header={<DialogHeader title="Confirmed" />}
      >
        <Flex justifyContent="center" pb="space.06" px="space.05">
          <CheckmarkIcon mt="2px" width="lg" />
        </Flex>
      </Dialog>
      <Outlet />
    </>
  );
}

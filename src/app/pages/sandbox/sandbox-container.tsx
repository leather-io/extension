import { Outlet } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';

export function SandboxContainer() {
  useRouteHeader(<ModalHeader hideActions defaultGoBack title="Sandbox" />, true);

  return (
    <Stack px="space.06" py="space.04">
      <Outlet />
    </Stack>
  );
}

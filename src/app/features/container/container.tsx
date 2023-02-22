import { Outlet } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { ContainerLayout } from './container.layout';

export function Container() {
  const [routeHeader] = useRouteHeaderState();

  useRestoreFormState();

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}

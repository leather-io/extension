import { Outlet } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { ContainerLayout } from './container.layout';

export function Container() {
  const [routeHeader] = useRouteHeaderState();

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}

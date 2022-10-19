import { Outlet, useSearchParams } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';
import { useOnMount } from '@app/common/hooks/use-on-mount';

import { ContainerLayout } from './container.layout';
import { useSetInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';

function useCacheInitialRouteSearchParams() {
  const [searchParams] = useSearchParams();
  const setParams = useSetInitialRouteSearchParams();

  useOnMount(() => setParams(searchParams));
}

export function Container() {
  const [routeHeader, _] = useRouteHeaderState();

  useCacheInitialRouteSearchParams();

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}

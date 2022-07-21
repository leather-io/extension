import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { ContainerLayout } from './container.layout';
import { useSetInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';

function useCacheInitialRouteSearchParams() {
  const [searchParams] = useSearchParams();
  const setParams = useSetInitialRouteSearchParams();

  useEffect(() => {
    setParams(searchParams);
    // We only want to set the initial searchParams, not all subsequent updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Container(): JSX.Element | null {
  const [routeHeader, _] = useRouteHeaderState();

  useCacheInitialRouteSearchParams();

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}

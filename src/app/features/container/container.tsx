import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';
import { useSaveAuthRequest } from '@app/common/hooks/auth/use-save-auth-request-callback';

import { ContainerLayout } from './container.layout';

function useCacheInitialRouteSearchParams() {
  const [searchParams] = useSearchParams();
  const [_, setParams] = useInitialRouteSearchParams();

  useEffect(() => {
    setParams(searchParams);
    // We only want to set the initial searchParams, not all subsequent updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Container(): JSX.Element | null {
  const [routeHeader, _] = useRouteHeaderState();

  useCacheInitialRouteSearchParams();
  useSaveAuthRequest();

  return (
    <ContainerLayout header={routeHeader}>
      <Outlet />
    </ContainerLayout>
  );
}

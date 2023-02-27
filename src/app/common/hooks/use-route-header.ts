import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

export function useRouteHeader(header: JSX.Element) {
  const location = useLocation();
  const [_, setRouteHeader] = useRouteHeaderState();
  useEffect(() => {
    setRouteHeader(header);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
}

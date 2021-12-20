import { useEffect } from 'react';

import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

export const useRouteHeader = (header: JSX.Element) => {
  const [_, setRouteHeader] = useRouteHeaderState();
  useEffect(() => {
    setRouteHeader(header);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

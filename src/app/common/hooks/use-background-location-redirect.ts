import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useLocationState } from '@app/common/hooks/use-location-state';

/*
when modals are opened in a new tab they lose the location.state.backgroundLocation
 this hook sets the backgroundLocation to be RouteUrls.Home to improve UX
*/
export function useBackgroundLocationRedirect() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  useEffect(() => {
    void (async () => {
      switch (true) {
        // FIXME ReceiveCollectibleOrdinal loses state?.btcAddressTaproot in a new tab
        // this can be improved to try and fetch btcAddressTaproot
        case pathname === RouteUrls.ReceiveCollectibleOrdinal && !state?.btcAddressTaproot:
          return navigate(RouteUrls.Home);

        case backgroundLocation === undefined:
          return navigate(pathname, {
            state: { backgroundLocation: { pathname: RouteUrls.Home } },
          });
        default:
          return false;
      }
    })();
  }, [backgroundLocation, navigate, pathname, state]);
}

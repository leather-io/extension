import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useLocationState } from '@app/common/hooks/use-location-state';

/**
 * If routes are accessed directly / opened in new tabs `backgroundLocation` is lost
 * this hook re-directs the users to home then overlays the modal so the BG is the home route
 */

export function useBackgroundLocationRedirect(baseUrl = RouteUrls.Home) {
  const { pathname, state, search } = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  useEffect(() => {
    void (async () => {
      if (backgroundLocation === undefined) {
        return navigate(
          { pathname, search },
          {
            state: { backgroundLocation: { pathname: baseUrl }, ...state },
          }
        );
      }
      return false;
    })();
  }, [backgroundLocation, baseUrl, navigate, pathname, state, search]);
}

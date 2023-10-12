import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// import { RouteUrls } from '@shared/route-urls';
import { useLocationState } from '@app/common/hooks/use-location-state';

// ts-unused-exports:disable-next-line
export function useBackgroundLocationRedirect() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  // console.log('backgroundLocation', backgroundLocation);
  // debugger;
  useEffect(() => {
    void (async () => {
      // if (backgroundLocation === undefined) {
      //   return navigate(pathname, {
      //     state: { backgroundLocation: { pathname: RouteUrls.Home }, ...state },
      //   });
      // }
      return false;
    })();
  }, [backgroundLocation, navigate, pathname, state]);
}

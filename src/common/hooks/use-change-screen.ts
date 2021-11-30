import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@routes/route-urls';
import { useCurrentScreenUpdate } from '@store/onboarding/onboarding.hooks';

type ChangeScreenAction = (path: RouteUrls, changeRoute?: boolean) => void;

export function useChangeScreen(): ChangeScreenAction {
  const navigate = useNavigate();
  const changeScreen = useCurrentScreenUpdate();

  const navigatePage = useCallback(
    (path: RouteUrls) => {
      navigate(path);
      changeScreen(path);
    },
    [changeScreen, navigate]
  );

  return useCallback(
    (path: RouteUrls, changeRoute = true) => {
      if (changeRoute) {
        return navigatePage(path);
      }
    },
    [navigatePage]
  );
}

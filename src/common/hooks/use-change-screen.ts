import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@routes/route-urls';

type ChangeScreenAction = (path: RouteUrls, changeRoute?: boolean) => void;

// TODO ROUTING REFACTOR: Why do we need this instead of just using useNavigate directly?
// We seemed to be saving the 'screen' state but I'm not sure why location.pathname isn't enough?
// I have never found that we use changeRoute as false?
export function useChangeScreen(): ChangeScreenAction {
  const navigate = useNavigate();

  const navigatePage = useCallback(
    (path: RouteUrls) => {
      navigate(path);
    },
    [navigate]
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

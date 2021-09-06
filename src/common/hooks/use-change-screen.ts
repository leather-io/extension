import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScreenPaths } from '@common/types';
import { useCurrentScreenUpdate } from '@store/onboarding/onboarding.hooks';

type ChangeScreenAction = (path: ScreenPaths, changeRoute?: boolean) => void;

export function useChangeScreen(): ChangeScreenAction {
  const navigate = useNavigate();
  const changeScreen = useCurrentScreenUpdate();

  const navigatePage = useCallback(
    (path: ScreenPaths) => {
      navigate(path);
      changeScreen(path);
    },
    [changeScreen, navigate]
  );

  return useCallback(
    (path: ScreenPaths, changeRoute = true) => {
      if (changeRoute) {
        return navigatePage(path);
      }
    },
    [navigatePage]
  );
}

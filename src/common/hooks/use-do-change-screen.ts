import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScreenPaths } from '@common/types';
import { useCurrentScreenUpdate } from '@store/onboarding/onboarding.hooks';

type DoChangeScreen = (path: ScreenPaths, changeRoute?: boolean) => void;

export function useDoChangeScreen(): DoChangeScreen {
  const navigate = useNavigate();
  const changeScreen = useCurrentScreenUpdate();

  const doNavigatePage = useCallback(
    (path: ScreenPaths) => {
      navigate(path);
      changeScreen(path);
    },
    [changeScreen, navigate]
  );

  return useCallback(
    (path: ScreenPaths, changeRoute = true) => {
      if (changeRoute) {
        return doNavigatePage(path);
      }
    },
    [doNavigatePage]
  );
}

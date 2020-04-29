import React from 'react';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useNavigate } from 'react-router-dom';

interface ToOptions {
  pathname?: string;
  hash?: string;
  search?: string;
}

interface NavigateProps {
  to: string | ToOptions;
  screenPath: ScreenPaths;
}

export const Navigate: React.FC<NavigateProps> = ({ to, screenPath }) => {
  const { doChangeScreen } = useAnalytics();
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
    doChangeScreen(screenPath, false);
  }, []);

  return null;
};

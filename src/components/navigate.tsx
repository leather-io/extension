import React, { useEffect } from 'react';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { ScreenPaths } from '@common/types';
import { useNavigate, ToOptions } from 'react-router-dom';

interface NavigateProps {
  to: string | ToOptions;
  screenPath: ScreenPaths;
}

export const Navigate: React.FC<NavigateProps> = ({ to, screenPath }) => {
  const doChangeScreen = useChangeScreen();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
    doChangeScreen(screenPath, false);
  }, [screenPath, doChangeScreen, to, navigate]);

  return null;
};

import React, { useEffect } from 'react';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { RouteUrls } from '@routes/route-urls';
import { useNavigate, ToOptions } from 'react-router-dom';

interface NavigateProps {
  to: string | ToOptions;
  screenPath: RouteUrls;
}

export const Navigate: React.FC<NavigateProps> = ({ to, screenPath }) => {
  const changeScreen = useChangeScreen();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
    changeScreen(screenPath, false);
  }, [screenPath, changeScreen, to, navigate]);

  return null;
};

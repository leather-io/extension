import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useDrawers } from '@common/hooks/use-drawers';
import { useWallet } from '@common/hooks/use-wallet';
import { RouteUrls } from '@common/types';
import React from 'react';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export const SignOutConfirmDrawer = () => {
  const { doSignOut } = useWallet();
  const changeScreen = useChangeScreen();
  const { setShowSignOut } = useDrawers();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={async () => {
        await doSignOut();
        setShowSignOut(false);
        changeScreen(RouteUrls.Installed);
      }}
      onUserSafelyReturnToHomepage={() => {
        setShowSignOut(false);
        changeScreen(RouteUrls.Home);
      }}
    />
  );
};

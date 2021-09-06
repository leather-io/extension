import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { ScreenPaths } from '@common/types';
import React from 'react';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export const SignOutConfirmPage = () => {
  const { doSignOut } = useWallet();
  const changeScreen = useChangeScreen();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={async () => {
        await doSignOut();
        changeScreen(ScreenPaths.INSTALLED);
      }}
      onUserSafelyReturnToHomepage={() => changeScreen(ScreenPaths.HOME)}
    />
  );
};

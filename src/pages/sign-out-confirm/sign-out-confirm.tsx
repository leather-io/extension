import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useDrawers } from '@common/hooks/use-drawers';
import { useWallet } from '@common/hooks/use-wallet';
import { RouteUrls } from '@routes/route-urls';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export const SignOutConfirmDrawer = () => {
  const { signOut } = useWallet();
  const navigate = useNavigate();
  const { setShowSignOut } = useDrawers();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={async () => {
        await signOut();
        setShowSignOut(false);
        navigate(RouteUrls.Onboarding);
      }}
      onUserSafelyReturnToHomepage={() => {
        setShowSignOut(false);
        navigate(RouteUrls.Home);
      }}
    />
  );
};

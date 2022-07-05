import { useNavigate } from 'react-router-dom';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { useWallet } from '@app/common/hooks/use-wallet';
import { RouteUrls } from '@shared/route-urls';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export const SignOutConfirmDrawer = () => {
  const { signOut } = useWallet();
  const navigate = useNavigate();
  const { setShowSignOut } = useDrawers();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={() => {
        setShowSignOut(false);
        navigate(RouteUrls.Onboarding);
        void signOut();
      }}
      onUserSafelyReturnToHomepage={() => {
        setShowSignOut(false);
        navigate(RouteUrls.Home);
      }}
    />
  );
};

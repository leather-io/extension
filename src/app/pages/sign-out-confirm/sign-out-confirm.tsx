import { useNavigate } from 'react-router-dom';

import { useWallet } from '@app/common/hooks/use-wallet';
import { RouteUrls } from '@shared/route-urls';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export const SignOutConfirmDrawer = () => {
  const { signOut } = useWallet();
  const navigate = useNavigate();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={() => {
        navigate(RouteUrls.Onboarding);
        void signOut();
      }}
      onUserSafelyReturnToHomepage={() => {
        navigate(RouteUrls.Home);
      }}
    />
  );
};

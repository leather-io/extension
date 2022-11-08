import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useWallet } from '@app/common/hooks/use-wallet';

import { SignOutConfirmLayout } from './sign-out-confirm-layout';

export function SignOutConfirmDrawer() {
  const { signOut } = useWallet();
  const navigate = useNavigate();

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={() => {
        navigate(RouteUrls.Onboarding);
        void signOut();
      }}
      onUserSafelyReturnToHomepage={() => navigate('..')}
    />
  );
}

import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useKeyActions } from '@app/common/hooks/use-key-actions';

import { SignOutConfirmLayout } from './sign-out-confirm.layout';

export function SignOutConfirmDrawer() {
  const { signOut } = useKeyActions();
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

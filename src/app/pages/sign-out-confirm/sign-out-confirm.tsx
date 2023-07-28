import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useLocationState } from '@app/common/hooks/use-location-state';

import { SignOutConfirmLayout } from './sign-out-confirm.layout';

export function SignOutConfirmDrawer() {
  useBackgroundLocationRedirect();
  const { signOut } = useKeyActions();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={() => {
        navigate(RouteUrls.Onboarding);
        void signOut();
      }}
      onUserSafelyReturnToHomepage={() => navigate(backgroundLocation)}
    />
  );
}

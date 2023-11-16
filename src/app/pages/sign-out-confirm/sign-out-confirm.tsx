import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';

import { SignOutConfirmLayout } from './sign-out-confirm.layout';

export function SignOutConfirmDrawer() {
  useBackgroundLocationRedirect();
  const { signOut } = useKeyActions();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');

  return (
    <SignOutConfirmLayout
      onUserDeleteWallet={() => {
        void signOut().finally(() => {
          navigate(RouteUrls.Onboarding);
        });
      }}
      onUserSafelyReturnToHomepage={() => navigate(backgroundLocation ?? '..')}
    />
  );
}

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { Header } from '@app/components/header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { RouteUrls } from '@shared/route-urls';
import { RequestPassword } from '@app/components/request-password';

export function Unlock(): JSX.Element {
  const { decodedAuthRequest } = useOnboardingState();
  const { showSignOut } = useDrawers();
  const navigate = useNavigate();

  useRouteHeader(<Header />);

  const handleSuccess = useCallback(async () => {
    if (decodedAuthRequest) {
      navigate(RouteUrls.ChooseAccount);
    } else {
      navigate(RouteUrls.Home);
    }
  }, [decodedAuthRequest, navigate]);

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        px={['loose', 'base-loose']}
        spacing="loose"
        textAlign={['left', 'center']}
        width="100%"
      >
        <RequestPassword
          title="Your session is locked"
          caption="Enter the password you set on this device"
          onSuccess={handleSuccess}
        />
        {/* TODO: Add this back when check for matching secret key is ready */}
        {/* <Caption textAlign="left">
          Forgot your password? Unlock your account by{' '}
          <Link display="inline" fontSize={-1} onClick={() => navigate(RouteUrls.SignIn)}>
            entering your Secret Key.
          </Link>
        </Caption> */}
        {showSignOut && <SignOutConfirmDrawer />}
      </Stack>
    </CenteredPageContainer>
  );
}

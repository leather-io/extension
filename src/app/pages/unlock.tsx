import { useNavigate } from 'react-router-dom';
import { Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { Header } from '@app/components/header';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { RequestPassword } from '@app/components/request-password';

export function Unlock() {
  const { showSignOut } = useDrawers();
  const navigate = useNavigate();

  useRouteHeader(<Header />);

  // Users land on unlock page as they've been directed here from `<AccountGate/>`.
  // On successful unlock, we can navigate back to the previous page, now
  // with account details.
  const handleSuccess = () => navigate(-1);

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

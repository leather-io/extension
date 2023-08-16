import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { Box } from 'leaf-styles/jsx';
import { token } from 'leaf-styles/tokens';

import { WALLET_ENVIRONMENT } from '@shared/environment';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPageMode, isPopupMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { Header } from '@app/components/header';
import { RequestPassword } from '@app/components/request-password';
import { useNewBrandApprover } from '@app/store/settings/settings.selectors';

export function Unlock() {
  const navigate = useNavigate();

  useRouteHeader(<Header />);

  const { hasApprovedNewBrand } = useNewBrandApprover();

  useEffect(() => {
    if (!hasApprovedNewBrand && isPopupMode() && WALLET_ENVIRONMENT !== 'testing') {
      openIndexPageInNewTab('/unlock/we-have-a-new-name');
      window.close();
    }
    if (!hasApprovedNewBrand && isFullPageMode()) {
      navigate('./we-have-a-new-name');
    }
  }, [hasApprovedNewBrand, navigate]);

  // Users land on unlock page as they've been directed here from `<AccountGate/>`.
  // On successful unlock, we can navigate back to the previous page, now
  // with account details.
  const handleSuccess = () => navigate(-1);

  return (
    <CenteredPageContainer>
      {/* Hide the logo when user hasn't consented yet */}
      {!hasApprovedNewBrand && (
        <Box position="fixed" w="200px" h="60px" background="brown.2" top={0} left={0} />
      )}
      <Stack
        maxWidth={token('sizes.centredPageFullWidth')}
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
      </Stack>
      <Outlet />
    </CenteredPageContainer>
  );
}

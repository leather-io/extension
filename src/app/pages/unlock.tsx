import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';
import { Box } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { WALLET_ENVIRONMENT } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

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

  const handleSuccess = () => navigate(RouteUrls.Home);

  return (
    <CenteredPageContainer>
      {/* Hide the logo when user hasn't consented yet */}
      {!hasApprovedNewBrand && (
        <Box position="fixed" w="200px" h="60px" background="brown.2" top={0} left={0} />
      )}
      <Stack
        maxWidth={token('sizes.centeredPageFullWidth')}
        px={['loose', 'base-loose']}
        gap="space.05"
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

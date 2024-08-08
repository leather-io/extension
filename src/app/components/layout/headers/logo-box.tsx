import { useLocation, useNavigate } from 'react-router-dom';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box } from 'leather-styles/jsx';

import { Logo } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

export function LogoBox({ isSessionLocked }: { isSessionLocked?: boolean | undefined }) {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldShowLogo =
    location.pathname === RouteUrls.Home || location.pathname === RouteUrls.Activity;

  const hideBelow = shouldShowLogo ? undefined : isSessionLocked ? undefined : 'sm';
  const hideFrom = shouldShowLogo ? undefined : isSessionLocked ? 'sm' : undefined;

  return (
    <Box
      height="headerContainerHeight"
      margin="auto"
      px="space.02"
      hideBelow={hideBelow}
      hideFrom={hideFrom}
    >
      <Logo
        data-testid={OnboardingSelectors.LogoRouteToHome}
        onClick={() => navigate(RouteUrls.Home)}
      />
    </Box>
  );
}

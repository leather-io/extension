import { useNavigate } from 'react-router-dom';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box } from 'leather-styles/jsx';

import { Logo } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

export function LogoBox({ isSessionLocked }: { isSessionLocked?: boolean | undefined }) {
  const navigate = useNavigate();
  return (
    <Box
      height="headerContainerHeight"
      margin="auto"
      px="space.02"
      hideBelow={isSessionLocked ? undefined : 'sm'}
      hideFrom={isSessionLocked ? 'sm' : undefined}
    >
      <Logo
        data-testid={OnboardingSelectors.LogoRouteToHome}
        onClick={() => navigate(RouteUrls.Home)}
      />
    </Box>
  );
}

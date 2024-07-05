import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box } from 'leather-styles/jsx';

import { Logo, NetworkModeBadge } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { ContainerLayout } from '../container.layout';
import { OnboardingHeader } from './onboarding-header';

interface OnboardingLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
}
export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const navigate = useNavigate();
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const { chain, name: chainName } = useCurrentNetworkState();

  const displayHeader = !pathname.match(RouteUrls.Onboarding);

  return (
    <ContainerLayout
      header={
        displayHeader ? (
          <OnboardingHeader
            onGoBack={() => navigate(-1)}
            networkBadge={
              <NetworkModeBadge
                isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                name={chainName}
              />
            }
            logo={
              // fixme this RouteUrls.ViewSecretKey needs work to show logo when viewing key but not when entering password
              pathname !== RouteUrls.ViewSecretKey && (
                <Box height="headerContainerHeight" margin="auto" px="space.02">
                  <Logo
                    data-testid={OnboardingSelectors.LogoRouteToHome}
                    onClick={() => navigate(RouteUrls.Home)}
                  />
                </Box>
              )
            }
          />
        ) : null
      }
      content={children}
    />
  );
}

import { memo, useMemo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

// #4164 FIXME migrate  IconButton, useMediaQuery
import { IconButton, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, FlexProps, HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BRANCH_NAME, COMMIT_SHA } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { LeatherButton } from '@app/components/button/button';
import { LeatherLogo } from '@app/components/leather-logo';
import { NetworkModeBadge } from '@app/components/network-mode-badge';

import { HamburgerIcon } from './icons/hamburger-icon';

interface HeaderProps extends FlexProps {
  actionButton?: React.JSX.Element;
  hideActions?: boolean;
  onClose?(): void;
  title?: string;
}
export const Header: React.FC<HeaderProps> = memo(props => {
  const { actionButton, hideActions, onClose, title, ...rest } = props;
  const { isShowingSettings, setIsShowingSettings } = useDrawers();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [desktopViewport] = useMediaQuery(`(min-width: ${token('sizes.desktopViewportMinWidth')})`);

  const leatherLogoIsClickable = useMemo(() => {
    return (
      pathname !== RouteUrls.RequestDiagnostics &&
      pathname !== RouteUrls.Onboarding &&
      pathname !== RouteUrls.BackUpSecretKey &&
      pathname !== RouteUrls.SetPassword
    );
  }, [pathname]);

  const version = useMemo(() => {
    switch (process.env.WALLET_ENVIRONMENT) {
      case 'production':
      case 'preview':
        return `v${VERSION}`;
      case 'feature':
        return `${BRANCH_NAME}#${COMMIT_SHA?.slice(0, 8)}`;
      case 'development':
        return 'dev';
      default:
        return null;
    }
  }, []);

  return (
    <Flex
      alignItems={hideActions ? 'center' : 'flex-start'}
      justifyContent="space-between"
      p="space.04"
      minHeight={['', '80px']}
      backgroundColor={[
        token('colors.accent.background-primary'),
        token('colors.accent.background-secondary'),
      ]}
      position="relative"
      {...rest}
    >
      {onClose ? (
        <styled.button flexBasis="20%" onClick={onClose}>
          <IconButton alignSelf="center" icon={FiArrowLeft} iconSize="16px" />
        </styled.button>
      ) : null}
      {!title && (!onClose || desktopViewport) ? (
        <Flex
          alignItems="center"
          flexBasis="60%"
          height="36px"
          justifyContent={onClose ? 'center' : 'unset'}
        >
          <Flex alignItems="flex-end">
            <LeatherLogo
              data-testid={OnboardingSelectors.LeatherLogoRouteToHome}
              isClickable={leatherLogoIsClickable}
              onClick={leatherLogoIsClickable ? () => navigate(RouteUrls.Home) : undefined}
            />
            <styled.span
              display={!version ? 'none' : 'unset'}
              fontFamily="mono"
              fontSize="10px"
              marginRight="10px"
              mb="-3px"
              ml="space.02"
              opacity={0.5}
            >
              {version}
            </styled.span>
          </Flex>
        </Flex>
      ) : (
        <styled.span
          alignSelf="center"
          flexBasis="60%"
          fontSize="16px"
          fontWeight={500}
          textStyle="label.02"
          lineHeight="24px"
          textAlign="center"
        >
          {title}
          {/*  #4164 TODO check this looks OK, then migrate remaining style */}
        </styled.span>
      )}
      <HStack alignItems="center" flexBasis="20%" justifyContent="flex-end">
        <NetworkModeBadge />
        {!hideActions && (
          <LeatherButton
            data-testid={SettingsSelectors.SettingsMenuBtn}
            onMouseUp={isShowingSettings ? undefined : () => setIsShowingSettings(true)}
            pointerEvents={isShowingSettings ? 'none' : 'all'}
            variant="ghost"
          >
            <HamburgerIcon />
          </LeatherButton>
        )}
        {actionButton ? actionButton : null}
      </HStack>
    </Flex>
  );
});

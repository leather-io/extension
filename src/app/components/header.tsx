import { memo, useMemo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, FlexProps, IconButton, Stack, Text, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';
import { token } from 'leaf-styles/tokens';

import { BRANCH_NAME, COMMIT_SHA } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { LeatherLogo } from '@app/components/leather-logo';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Title } from '@app/components/typography';

import { LeatherButton } from './button/button';
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
  const [isNarrowViewport] = useMediaQuery('(max-width: 640px)');

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
      p="base"
      minHeight={['', '80px']}
      position="relative"
      background={isNarrowViewport ? token('colors.brown.1') : token('colors.brown.2')}
      {...rest}
    >
      {onClose ? (
        <Box flexBasis="20%" onClick={onClose} as="button">
          <IconButton alignSelf="center" icon={FiArrowLeft} iconSize="16px" />
        </Box>
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
            <Text
              display={!version ? 'none' : 'unset'}
              fontFamily="mono"
              fontSize="10px"
              marginRight="10px"
              mb="-3px"
              ml="tight"
              opacity={0.5}
            >
              {version}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Title
          alignSelf="center"
          flexBasis="60%"
          fontSize="16px"
          fontWeight={500}
          lineHeight="24px"
          textAlign="center"
          {...rest}
        >
          {title}
        </Title>
      )}
      <Stack alignItems="center" flexBasis="20%" isInline justifyContent="flex-end">
        <NetworkModeBadge />
        {!hideActions && (
          <LeatherButton
            data-testid={SettingsMenuSelectors.SettingsMenuBtn}
            onMouseUp={isShowingSettings ? undefined : () => setIsShowingSettings(true)}
            pointerEvents={isShowingSettings ? 'none' : 'all'}
            variant="ghost"
          >
            <HamburgerIcon />
          </LeatherButton>
        )}
        {actionButton ? actionButton : null}
      </Stack>
    </Flex>
  );
});

import { memo, useMemo } from 'react';
import { FiArrowLeft, FiMoreHorizontal } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, FlexProps, IconButton, Stack, Text, color, useMediaQuery } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';

import { BRANCH_NAME, COMMIT_SHA } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { HiroWalletLogo } from '@app/components/hiro-wallet-logo';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Title } from '@app/components/typography';

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

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  const hiroWalletLogoIsClickable = useMemo(() => {
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
      position="relative"
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
            <HiroWalletLogo
              data-testid={OnboardingSelectors.HiroWalletLogoRouteToHome}
              isClickable={hiroWalletLogoIsClickable}
              onClick={hiroWalletLogoIsClickable ? () => navigate(RouteUrls.Home) : undefined}
            />
            <Text
              color={color('text-caption')}
              display={!version ? 'none' : 'unset'}
              fontFamily="mono"
              fontSize="10px"
              lineHeight="10px"
              marginRight="10px"
              mb="2px"
              ml="tight"
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
        <NetworkModeBadge top="4px" />
        {!hideActions && (
          <IconButton
            _hover={{ color: color('text-title') }}
            color={color('text-caption')}
            data-testid={SettingsMenuSelectors.SettingsMenuBtn}
            iconSize="16px"
            icon={FiMoreHorizontal}
            onMouseUp={isShowingSettings ? undefined : () => setIsShowingSettings(true)}
            pointerEvents={isShowingSettings ? 'none' : 'all'}
          />
        )}
        {actionButton ? actionButton : null}
      </Stack>
    </Flex>
  );
});

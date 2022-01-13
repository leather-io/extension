import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, Flex, FlexProps, IconButton, Stack } from '@stacks/ui';
import { FiMoreHorizontal, FiArrowLeft } from 'react-icons/fi';

import { HiroWalletLogo } from '@app/components/hiro-wallet-logo';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { isFullPage } from '@app/common/utils';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Caption, Title } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';
import { RouteUrls } from '@shared/route-urls';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

interface HeaderProps extends FlexProps {
  onClose?: () => void;
  hideActions?: boolean;
  title?: string;
}
export const Header: React.FC<HeaderProps> = memo(props => {
  const { onClose, title, hideActions, ...rest } = props;
  const { showSettings, setShowSettings } = useDrawers();
  const navigate = useNavigate();

  const version = useMemo(() => {
    switch (process.env.WALLET_ENVIRONMENT) {
      case 'production':
      case 'preview':
        return `v${VERSION}`;
      case 'feature':
        return BRANCH;
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
        <IconButton alignSelf="center" icon={FiArrowLeft} iconSize="16px" onClick={onClose} />
      ) : null}
      {!title && (!onClose || isFullPage) ? (
        <Stack
          alignItems="flex-end"
          flexGrow={1}
          height="36px"
          isInline
          justifyContent={onClose ? 'center' : 'unset'}
        >
          <HiroWalletLogo
            data-testid={OnboardingSelectors.HiroWalletLogoRouteToHome}
            onClick={() => navigate(RouteUrls.Home)}
          />
          <Caption
            color={color('text-caption')}
            display={!version ? 'none' : 'unset'}
            fontFamily="mono"
            marginRight="10px"
            mb="2px"
            variant="c3"
          >
            {version}
          </Caption>
        </Stack>
      ) : (
        <Title
          alignSelf="center"
          fontSize="16px"
          fontWeight={500}
          lineHeight="24px"
          pr={hideActions ? '36px' : 'unset'}
          {...rest}
        >
          {title}
        </Title>
      )}
      <Stack alignItems="center" isInline>
        <NetworkModeBadge />
        {!hideActions && (
          <IconButton
            _hover={{ color: color('text-title') }}
            color={color('text-caption')}
            data-testid={SettingsSelectors.MenuBtn}
            iconSize="16px"
            icon={FiMoreHorizontal}
            onMouseUp={showSettings ? undefined : () => setShowSettings(true)}
            pointerEvents={showSettings ? 'none' : 'all'}
          />
        )}
      </Stack>
    </Flex>
  );
});

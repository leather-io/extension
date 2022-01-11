import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, Flex, FlexProps, IconButton, Stack } from '@stacks/ui';
import { FiMoreHorizontal, FiArrowLeft } from 'react-icons/fi';

import { HiroWalletLogo } from '@app/components/hiro-wallet-logo';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { isFullPage } from '@app/common/utils';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Caption, Title } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';
import { RouteUrls } from '@shared/route-urls';

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
      p="loose"
      alignItems={hideActions ? 'center' : 'flex-start'}
      justifyContent="space-between"
      position="relative"
      {...rest}
    >
      <Stack alignItems="center" isInline>
        {onClose ? <IconButton icon={FiArrowLeft} onClick={onClose} /> : null}
        {title ? (
          <Title fontSize="20px" fontWeight={500} lineHeight="28px" {...props}>
            {title}
          </Title>
        ) : null}
      </Stack>
      <Stack
        alignItems="center"
        flexGrow={1}
        isInline
        justifyContent={onClose ? 'center' : 'unset'}
        pt="7px"
      >
        {!onClose || isFullPage ? (
          <>
            <HiroWalletLogo
              data-testid={OnboardingSelectors.HiroWalletLogoRouteToHome}
              onClick={() => navigate(RouteUrls.Home)}
            />
            <Caption
              display={!version ? 'none' : 'unset'}
              pt="extra-tight"
              mt="2px"
              color="#8D929A"
              variant="c3"
              marginRight="10px"
              fontFamily="mono"
            >
              {version}
            </Caption>
          </>
        ) : null}
      </Stack>
      <Stack alignItems="center" flexShrink={0} isInline pt={hideActions ? '7px' : 0}>
        <NetworkModeBadge />
        {!hideActions && (
          <IconButton
            _hover={{ color: color('text-title') }}
            color={color('text-caption')}
            data-testid="menu-button"
            iconSize="20px"
            icon={FiMoreHorizontal}
            onMouseUp={showSettings ? undefined : () => setShowSettings(true)}
            pointerEvents={showSettings ? 'none' : 'all'}
            size="36px"
            {...props}
          />
        )}
      </Stack>
    </Flex>
  );
});

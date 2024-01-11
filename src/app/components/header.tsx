import { useNavigate } from 'react-router-dom';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, FlexProps, HStack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { LeatherLogo } from '@app/components/leather-logo';
import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Button } from '@app/ui/components/button/button';
import { ArrowLeftIcon } from '@app/ui/components/icons/arrow-left-icon';
import { HamburgerIcon } from '@app/ui/components/icons/hamburger-icon';

import { AppVersion } from './app-version';

interface HeaderProps extends FlexProps {
  actionButton?: React.JSX.Element;
  hideActions?: boolean;
  onClose?(): void;
  title?: string;
}
export function Header(props: HeaderProps) {
  const { actionButton, hideActions, onClose, title, ...rest } = props;
  const { isShowingSettings, setIsShowingSettings } = useDrawers();
  const navigate = useNavigate();

  const isBreakpointSm = useViewportMinWidth('sm');

  return (
    <Flex
      alignItems={hideActions ? 'center' : 'flex-start'}
      backgroundColor={['accent.background-primary', 'accent.background-secondary']}
      justifyContent="space-between"
      minHeight={['unset', '80px']}
      p="space.04"
      position="relative"
      {...rest}
    >
      {onClose ? (
        <Flex flexBasis="20%">
          <Button onClick={onClose} variant="ghost">
            <ArrowLeftIcon />
          </Button>
        </Flex>
      ) : null}
      {!title && (!onClose || isBreakpointSm) ? (
        <Flex
          alignItems="center"
          flexBasis="60%"
          height="32px"
          justifyContent={onClose ? 'center' : 'unset'}
          width="100%"
        >
          <HStack alignItems="flex-end" gap="space.01">
            <LeatherLogo
              data-testid={OnboardingSelectors.LeatherLogoRouteToHome}
              onClick={() => navigate(RouteUrls.Home)}
            />
            <AppVersion />
          </HStack>
        </Flex>
      ) : (
        <styled.span alignSelf="center" flexBasis="60%" textAlign="center" textStyle="heading.05">
          {title}
        </styled.span>
      )}
      <HStack alignItems="center" flexBasis="20%" justifyContent="flex-end">
        <NetworkModeBadge />
        {!hideActions && (
          <Button
            data-testid={SettingsSelectors.SettingsMenuBtn}
            onClick={() => setIsShowingSettings(!isShowingSettings)}
            variant="ghost"
          >
            <HamburgerIcon />
          </Button>
        )}
        {actionButton ? actionButton : null}
      </HStack>
    </Flex>
  );
}

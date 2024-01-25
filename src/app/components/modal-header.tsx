import { useNavigate } from 'react-router-dom';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';

import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Button } from '@app/ui/components/button/button';
import { ArrowLeftIcon } from '@app/ui/components/icons/arrow-left-icon';
import { CloseIcon } from '@app/ui/components/icons/close-icon';

interface ModalHeaderProps {
  actionButton?: React.JSX.Element;
  closeIcon?: boolean;
  hideActions?: boolean;
  onClose?(): void;
  onGoBack?(): void;
  defaultClose?: boolean;
  defaultGoBack?: boolean;
  title: string;
}

export function ModalHeader({
  actionButton,
  hideActions,
  onClose,
  onGoBack,
  closeIcon,
  title,
  defaultGoBack,
  defaultClose,
  ...rest
}: ModalHeaderProps) {
  const navigate = useNavigate();

  function defaultCloseAction() {
    navigate(RouteUrls.Home);
  }
  function defaultGoBackAction() {
    navigate(-1);
  }

  const hasCloseIcon = onClose || defaultClose;

  return (
    <Flex
      alignItems={hideActions ? 'center' : 'flex-start'}
      justifyContent="space-between"
      p="space.04"
      position="relative"
      {...rest}
    >
      {onGoBack || defaultGoBack ? (
        <Box flexBasis="32.5%">
          <Button
            data-testid={SharedComponentsSelectors.ModalHeaderBackBtn}
            alignSelf="center"
            onClick={onGoBack || defaultGoBackAction}
            variant="ghost"
          >
            <ArrowLeftIcon />
          </Button>
        </Box>
      ) : (
        <Box flexBasis="32.5%" />
      )}

      <Flex alignItems="center" flexBasis="35%" justifyContent="center">
        <styled.h5 textStyle="heading.05" color={token('colors.accent.background-secondary')}>
          {title}
        </styled.h5>
      </Flex>

      <Flex alignItems="center" flexBasis="32.5%" justifyContent="flex-end" position="relative">
        <NetworkModeBadge />
        {hasCloseIcon && (
          <Button ml="space.02" onClick={onClose || defaultCloseAction} variant="ghost">
            <CloseIcon />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

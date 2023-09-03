import { FiArrowLeft, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, IconButton } from '@stacks/ui';
import { Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';

import { NetworkModeBadge } from '@app/components/network-mode-badge';

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
      p="base"
      position="relative"
      {...rest}
    >
      {onGoBack || defaultGoBack ? (
        <Box flexBasis="20%" onClick={onGoBack || defaultGoBackAction} as="button">
          <IconButton alignSelf="center" icon={FiArrowLeft} iconSize="24px" />
        </Box>
      ) : (
        <Box flexBasis="20%" />
      )}

      <Flex alignItems="center" flex="60%" justifyContent="center">
        <styled.h5 textStyle="heading.05" color={token('colors.accent.background-secondary')}>
          {title}
        </styled.h5>
      </Flex>

      <Flex alignItems="center" flexBasis="20%" justifyContent="flex-end" position="relative">
        <NetworkModeBadge position="absolute" right={hasCloseIcon ? '35px' : '15px'} />
        {hasCloseIcon && (
          <IconButton
            onClick={onClose || defaultCloseAction}
            alignSelf="center"
            icon={FiX}
            iconSize="24px"
          />
        )}
      </Flex>
    </Flex>
  );
}

import { FiArrowLeft, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, FlexProps, IconButton } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { NetworkModeBadge } from '@app/components/network-mode-badge';
import { Title } from '@app/components/typography';

interface ModalHeaderProps extends FlexProps {
  actionButton?: JSX.Element;
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
        <Title
          alignSelf="center"
          fontSize="16px"
          fontWeight={500}
          lineHeight="24px"
          textAlign="center"
          {...rest}
        >
          {title}
        </Title>
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

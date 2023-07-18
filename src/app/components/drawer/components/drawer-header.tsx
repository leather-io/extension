import { FiArrowLeft, FiX as IconX } from 'react-icons/fi';

import { Box, Flex } from '@stacks/ui';
import { useHover } from 'use-events';

import { Caption, Title } from '@app/components/typography';

import { HeaderActionButton } from './header-action-button';

interface DrawerHeaderProps {
  enableGoBack?: boolean;
  icon?: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onClose?(): void;
  onGoBack(): void;
  title?: string;
  waitingOnPerformedActionMessage?: string;
}
export function DrawerHeader({
  enableGoBack,
  icon,
  isWaitingOnPerformedAction,
  onClose,
  onGoBack,
  title,
  waitingOnPerformedActionMessage,
}: DrawerHeaderProps) {
  const [isHovered, bind] = useHover();

  return (
    <Flex
      pb="base"
      justifyContent="space-between"
      alignItems="center"
      pt="loose"
      px="loose"
      {...bind}
    >
      {enableGoBack ? (
        <HeaderActionButton
          icon={FiArrowLeft}
          isWaitingOnPerformedAction={isWaitingOnPerformedAction}
          onAction={onGoBack}
        />
      ) : (
        <Box size="36px" />
      )}
      {icon && icon}
      {title && (
        <Title fontSize="20px" lineHeight="28px">
          {title}
        </Title>
      )}
      {isHovered && isWaitingOnPerformedAction && (
        <Caption fontSize="14px" fontWeight={500}>
          {waitingOnPerformedActionMessage}
        </Caption>
      )}
      {onClose && (
        <HeaderActionButton
          icon={IconX}
          isWaitingOnPerformedAction={isWaitingOnPerformedAction}
          onAction={onClose}
        />
      )}
    </Flex>
  );
}

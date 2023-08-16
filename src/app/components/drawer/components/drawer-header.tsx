import { Box, Flex } from '@stacks/ui';
import { styled } from 'leaf-styles/jsx';
import { useHover } from 'use-events';

import { ArrowLeftIcon } from '@app/components/icons/arrow-left-icon';
import { CloseIcon } from '@app/components/icons/close-icon';
import { Caption } from '@app/components/typography';

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
          icon={<ArrowLeftIcon />}
          isWaitingOnPerformedAction={isWaitingOnPerformedAction}
          onAction={onGoBack}
        />
      ) : (
        <Box size="36px" />
      )}
      {icon && icon}
      {title && <styled.h1 textStyle="heading.05">{title}</styled.h1>}
      {isHovered && isWaitingOnPerformedAction && (
        <Caption fontSize="14px" fontWeight={500}>
          {waitingOnPerformedActionMessage}
        </Caption>
      )}
      {onClose && (
        <HeaderActionButton
          icon={<CloseIcon />}
          isWaitingOnPerformedAction={isWaitingOnPerformedAction}
          onAction={onClose}
        />
      )}
    </Flex>
  );
}

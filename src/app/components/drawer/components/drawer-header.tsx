import { Box, Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
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
      pb="space.04"
      justifyContent="space-between"
      alignItems="center"
      pt="space.05"
      px="space.05"
      {...bind}
    >
      {enableGoBack ? (
        <HeaderActionButton
          icon={<ArrowLeftIcon />}
          isWaitingOnPerformedAction={isWaitingOnPerformedAction}
          onAction={onGoBack}
        />
      ) : (
        // #4164 FIXME migrate check and refactor if this is needed
        <Box width="36px" height="36px" />
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

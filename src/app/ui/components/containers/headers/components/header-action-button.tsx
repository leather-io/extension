import { FlexProps } from 'leather-styles/jsx';

import { IconButton } from '../../../icon-button/icon-button';

interface HeaderActionButtonProps extends FlexProps {
  icon: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
  dataTestId: string;
}
export function HeaderActionButton({
  icon,
  isWaitingOnPerformedAction,
  onAction,
  dataTestId,
}: HeaderActionButtonProps) {
  return (
    <IconButton
      height="headerContainerHeight"
      _hover={{
        bg: isWaitingOnPerformedAction ? 'unset' : 'ink.component-background-hover',
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      color="ink.action-primary-default"
      data-testid={dataTestId}
      icon={icon}
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      transition="transition"
      userSelect="none"
      zIndex={999}
    />
  );
}

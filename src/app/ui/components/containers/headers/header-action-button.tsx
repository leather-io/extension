import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex } from 'leather-styles/jsx';

interface HeaderActionButtonProps {
  icon?: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
}
export function HeaderActionButton({
  icon,
  isWaitingOnPerformedAction,
  onAction,
}: HeaderActionButtonProps) {
  return (
    <Flex
      _hover={{
        bg: isWaitingOnPerformedAction ? 'unset' : 'ink.component-background-hover',
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      data-testid={HomePageSelectors.HeaderActionBtn}
      borderRadius="xs"
      color="ink.action-primary-default"
      height="headerContainerHeight"
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      transition="transition"
      userSelect="none"
      p="space.02"
      zIndex={999}
    >
      {icon}
    </Flex>
  );
}

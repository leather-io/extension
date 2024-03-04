import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex, FlexProps } from 'leather-styles/jsx';

import { IconButton } from '../../icon-button/icon-button';

interface HeaderActionButtonProps extends FlexProps {
  icon: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
}
export function HeaderActionButton({
  icon,
  isWaitingOnPerformedAction,
  onAction,
}: HeaderActionButtonProps) {
  return (
    <Flex height="headerContainerHeight">
      <IconButton
        _hover={{
          bg: isWaitingOnPerformedAction ? 'unset' : 'ink.component-background-hover',
          cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
        }}
        color="ink.action-primary-default"
        data-testid={HomePageSelectors.HeaderActionBtn}
        icon={icon}
        onClick={isWaitingOnPerformedAction ? undefined : onAction}
        opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
        transition="transition"
        userSelect="none"
        zIndex={999}
      />
    </Flex>
  );
}

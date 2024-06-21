import { FlexProps } from 'leather-styles/jsx';

import { IconButton } from '@leather.io/ui';

interface HeaderActionButtonProps extends FlexProps {
  icon: React.JSX.Element;
  onAction(): void;
  dataTestId: string;
}
export function HeaderActionButton({ icon, onAction, dataTestId }: HeaderActionButtonProps) {
  return (
    <IconButton
      height="headerContainerHeight"
      _hover={{
        bg: 'ink.component-background-hover',
        cursor: 'pointer',
      }}
      color="ink.action-primary-default"
      data-testid={dataTestId}
      icon={icon}
      onClick={onAction}
      transition="transition"
      userSelect="none"
      zIndex={999}
    />
  );
}

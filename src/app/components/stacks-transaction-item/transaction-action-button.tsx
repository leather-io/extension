import { HStack, styled } from 'leather-styles/jsx';

interface ActionButtonProps {
  icon?: React.ReactNode;
  isEnabled?: boolean;
  isSelected: boolean;
  label: string;
  maxWidth?: string;
  onButtonClick(): void;
  textColor?: string;
}

export function TransactionActionButton(props: ActionButtonProps) {
  const { isEnabled, isSelected, onButtonClick, label, icon, textColor, maxWidth } = props;
  const isActive = isEnabled && !isSelected;

  if (!isActive) return null;

  return (
    <styled.button
      _hover={{ color: 'ink.text-subdued' }}
      bg="ink.background-primary"
      maxWidth={maxWidth}
      ml="auto"
      onClick={e => {
        onButtonClick();
        e.stopPropagation();
      }}
      position="relative"
      px="space.02"
      py="space.01"
      rounded="xs"
      zIndex={999}
    >
      <HStack gap="space.01">
        {icon}
        <styled.span textStyle="label.03" color={textColor}>
          {label}
        </styled.span>
      </HStack>
    </styled.button>
  );
}

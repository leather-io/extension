import { HStack, styled } from 'leather-styles/jsx';

interface CancelTransactionButtonProps {
  isEnabled?: boolean;
  isSelected: boolean;
  onCancelTransaction(): void;
}
export function CancelTransactionButton(props: CancelTransactionButtonProps) {
  const { isEnabled, isSelected, onCancelTransaction } = props;
  const isActive = isEnabled && !isSelected;

  return (
    isActive && (
      <styled.button
        _hover={{ color: 'ink.text-subdued' }}
        bg="ink.background-primary"
        maxWidth="125px"
        ml="auto"
        onClick={e => {
          onCancelTransaction();
          e.stopPropagation();
        }}
        pointerEvents={!isActive ? 'none' : 'all'}
        position="relative"
        px="space.02"
        py="space.01"
        rounded="xs"
        zIndex={999}
      >
        <HStack gap="space.01">
          <styled.span textStyle="label.03" color="yellow.action-primary-default">
            Cancel transaction
          </styled.span>
        </HStack>
      </styled.button>
    )
  );
}

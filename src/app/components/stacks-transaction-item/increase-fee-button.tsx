import { HStack, styled } from 'leather-styles/jsx';

import { ChevronsRightIcon } from '@leather.io/ui';

interface IncreaseFeeButtonProps {
  isEnabled?: boolean;
  isSelected: boolean;
  onIncreaseFee(): void;
}
export function IncreaseFeeButton(props: IncreaseFeeButtonProps) {
  const { isEnabled, isSelected, onIncreaseFee } = props;
  const isActive = isEnabled && !isSelected;

  return (
    <styled.button
      _hover={{ color: 'ink.text-subdued' }}
      bg="ink.background-primary"
      onClick={e => {
        onIncreaseFee();
        e.stopPropagation();
      }}
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      position="relative"
      px="space.02"
      rounded="xs"
      zIndex={999}
    >
      <HStack gap="space.01">
        <ChevronsRightIcon color="stacks" variant="small" />
        <styled.span textStyle="label.03">Increase fee</styled.span>
      </HStack>
    </styled.button>
  );
}

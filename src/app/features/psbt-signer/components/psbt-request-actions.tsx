import { Box, HStack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/ui/components/button';

interface PsbtRequestActionsProps {
  isLoading?: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtRequestActions({ isLoading, onCancel, onSignPsbt }: PsbtRequestActionsProps) {
  return (
    <Box
      bg="accent.background-primary"
      borderTop="default"
      bottom="0px"
      height="96px"
      position="absolute"
      px="space.05"
      width="100%"
      zIndex={999}
    >
      <HStack gap="space.04" mt="space.05">
        <LeatherButton flexGrow={1} onClick={onCancel} variant="outline">
          Cancel
        </LeatherButton>
        <LeatherButton flexGrow={1} aria-busy={isLoading} onClick={onSignPsbt}>
          Confirm
        </LeatherButton>
      </HStack>
    </Box>
  );
}

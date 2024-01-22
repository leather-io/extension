import { Box, HStack } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';

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
        <Button flexGrow={1} onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button flexGrow={1} aria-busy={isLoading} onClick={onSignPsbt}>
          Confirm
        </Button>
      </HStack>
    </Box>
  );
}

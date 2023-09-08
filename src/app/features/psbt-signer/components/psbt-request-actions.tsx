import { Box } from 'leather-styles/jsx';
import { HStack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherButton } from '@app/components/button/button';

interface PsbtRequestActionsProps {
  isLoading?: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtRequestActions({ isLoading, onCancel, onSignPsbt }: PsbtRequestActionsProps) {
  return (
    <Box
      bg={token('colors.accent.background-primary')}
      borderTop="1px solid #DCDDE2"
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

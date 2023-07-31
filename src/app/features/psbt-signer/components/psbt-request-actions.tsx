import { Box, Button, Stack, color } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

interface PsbtRequestActionsProps {
  isLoading?: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtRequestActions({ isLoading, onCancel, onSignPsbt }: PsbtRequestActionsProps) {
  return (
    <Box
      bg={color('bg')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height="96px"
      position="absolute"
      px="loose"
      width="100%"
      zIndex={999}
    >
      <Stack isInline mt="loose" spacing="base">
        <Button borderRadius="10px" flexGrow={1} mode="tertiary" onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton borderRadius="10px" flexGrow={1} isLoading={isLoading} onClick={onSignPsbt}>
          Confirm
        </PrimaryButton>
      </Stack>
    </Box>
  );
}

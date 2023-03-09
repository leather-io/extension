import { Button, Stack } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

interface PsbtRequestActionsProps {
  isLoading: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtRequestActions({ isLoading, onCancel, onSignPsbt }: PsbtRequestActionsProps) {
  return (
    <Stack isInline spacing="base">
      <Button borderRadius="10px" flexGrow={1} mode="tertiary" onClick={onCancel}>
        Cancel
      </Button>
      <PrimaryButton borderRadius="10px" flexGrow={1} isLoading={isLoading} onClick={onSignPsbt}>
        Confirm
      </PrimaryButton>
    </Stack>
  );
}

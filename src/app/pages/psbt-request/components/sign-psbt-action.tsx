import { Button, Stack } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

interface SignPsbtActionProps {
  isLoading: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function SignPsbtAction({ isLoading, onCancel, onSignPsbt }: SignPsbtActionProps) {
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

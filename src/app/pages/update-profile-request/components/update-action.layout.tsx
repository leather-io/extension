import { Button, Stack } from '@stacks/ui';

interface UpdateActionProfileProps {
  onUpdateProfile: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function UpdateActionLayout({
  onUpdateProfile,
  onCancel,
  isLoading,
}: UpdateActionProfileProps) {
  return (
    <Stack isInline>
      <Button onClick={onCancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button
        type="submit"
        flexGrow={1}
        borderRadius="10px"
        onClick={onUpdateProfile}
        isLoading={isLoading}
      >
        Update
      </Button>
    </Stack>
  );
}

import { Button, Stack } from '@stacks/ui';
import { TestAppSelectors } from '@tests/selectors/test-app.selectors';

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
        data-testid={TestAppSelectors.BtnUpdateProfile}
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

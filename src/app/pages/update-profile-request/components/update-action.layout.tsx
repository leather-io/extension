import { UpdateProfileRequestSelectors } from '@tests/selectors/requests.selectors';
import { HStack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

interface UpdateActionLayoutProps {
  onUpdateProfile(): Promise<void>;
  onCancel(): void;
  isLoading: boolean;
}
export function UpdateActionLayout({
  onUpdateProfile,
  onCancel,
  isLoading,
}: UpdateActionLayoutProps) {
  return (
    <HStack>
      <Button onClick={onCancel} flexGrow={1} variant="outline">
        Cancel
      </Button>
      <Button
        aria-busy={isLoading}
        data-testid={UpdateProfileRequestSelectors.BtnUpdateProfile}
        type="submit"
        flexGrow={1}
        onClick={onUpdateProfile}
      >
        Update
      </Button>
    </HStack>
  );
}

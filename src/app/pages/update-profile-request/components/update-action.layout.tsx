import { UpdateProfileRequestSelectors } from '@tests/selectors/requests.selectors';
import { HStack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/ui/components/button';

interface UpdateActionLayoutProps {
  onUpdateProfile: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}
export function UpdateActionLayout({
  onUpdateProfile,
  onCancel,
  isLoading,
}: UpdateActionLayoutProps) {
  return (
    <HStack>
      <LeatherButton onClick={onCancel} flexGrow={1} variant="outline">
        Cancel
      </LeatherButton>
      <LeatherButton
        aria-busy={isLoading}
        data-testid={UpdateProfileRequestSelectors.BtnUpdateProfile}
        type="submit"
        flexGrow={1}
        onClick={onUpdateProfile}
      >
        Update
      </LeatherButton>
    </HStack>
  );
}

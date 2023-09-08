import { UpdateProfileRequestSelectors } from '@tests/selectors/requests.selectors';
import { HStack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

interface UpdateActionProfileProps {
  onUpdateProfile: () => Promise<void>;
  onCancel: () => void;
  // isLoading: boolean;
}

export function UpdateActionLayout({
  onUpdateProfile,
  onCancel,
}: // isLoading,
UpdateActionProfileProps) {
  return (
    <HStack>
      {/* FIXME - figure out tertiary variant of LeatherButton */}
      <LeatherButton onClick={onCancel} flexGrow={1} borderRadius="10px" variant="ghost">
        Cancel
      </LeatherButton>
      <LeatherButton
        data-testid={UpdateProfileRequestSelectors.BtnUpdateProfile}
        type="submit"
        flexGrow={1}
        borderRadius="10px"
        onClick={onUpdateProfile}
        // #4164 FIXME migrate - add isLoading variant to button if needed
        // isLoading={isLoading}
      >
        Update
      </LeatherButton>
    </HStack>
  );
}

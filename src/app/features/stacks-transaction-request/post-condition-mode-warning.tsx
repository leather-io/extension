import { PostConditionMode } from '@stacks/transactions';

import { WarningLabel } from '@app/components/warning-label';
import { usePostConditionModeState } from '@app/store/transactions/post-conditions.hooks';

export function PostConditionModeWarning(): React.JSX.Element | null {
  const mode = usePostConditionModeState();

  if (mode !== PostConditionMode.Allow) return null;

  return (
    <WarningLabel mb="space.05" title="This transaction is not secure" width="100%">
      If you confirm, you allow it to transfer any of your tokens. Only confirm if you trust and
      have verified the contract.
    </WarningLabel>
  );
}

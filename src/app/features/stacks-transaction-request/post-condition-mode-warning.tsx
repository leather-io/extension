import { PostConditionMode } from '@stacks/transactions';

import { Callout } from '@leather.io/ui';

import { usePostConditionModeState } from '@app/store/transactions/post-conditions.hooks';

export function PostConditionModeWarning(): React.JSX.Element | null {
  const mode = usePostConditionModeState();

  if (mode !== PostConditionMode.Allow) return null;

  return (
    <Callout
      variant="warning"
      mb="space.05"
      title="This transaction can transfer any of your assets"
    >
      If you confirm, you allow it to transfer any of your tokens. Only confirm if you trust and
      have verified the contract.
    </Callout>
  );
}

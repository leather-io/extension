import { Button, Stack } from '@stacks/ui';

import { useWalletType } from '@app/common/use-wallet-type';

interface StacksSignMessageActionsProps {
  onSignMessage(): void;
  onSignMessageCancel(): void;
  isLoading: boolean;
}
export function SignMessageActions(props: StacksSignMessageActionsProps) {
  const { onSignMessage, onSignMessageCancel, isLoading } = props;
  const { whenWallet } = useWalletType();

  return (
    <Stack isInline>
      <Button onClick={onSignMessageCancel} flexGrow={1} borderRadius="10px" mode="tertiary">
        Cancel
      </Button>
      <Button
        type="button"
        flexGrow={1}
        borderRadius="10px"
        onClick={onSignMessage}
        isLoading={isLoading}
      >
        {whenWallet({ software: 'Sign', ledger: 'Sign on Ledger' })}
      </Button>
    </Stack>
  );
}

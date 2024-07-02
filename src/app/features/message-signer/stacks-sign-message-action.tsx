import { HStack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

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
    <HStack gap="space.04">
      <Button onClick={onSignMessageCancel} variant="outline" width="50%">
        Cancel
      </Button>
      <Button aria-busy={isLoading} onClick={onSignMessage} width="50%">
        {whenWallet({ software: 'Sign', ledger: 'Sign on Ledger' })}
      </Button>
    </HStack>
  );
}

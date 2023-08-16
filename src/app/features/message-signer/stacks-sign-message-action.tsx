import { HStack } from 'leaf-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { LeatherButton } from '@app/components/button/button';

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
      <LeatherButton onClick={onSignMessageCancel} variant="outline" width="50%">
        Cancel
      </LeatherButton>
      <LeatherButton aria-busy={isLoading} onClick={onSignMessage} width="50%">
        {whenWallet({ software: 'Sign', ledger: 'Sign on Ledger' })}
      </LeatherButton>
    </HStack>
  );
}

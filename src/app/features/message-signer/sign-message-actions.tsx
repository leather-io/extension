import { HStack } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { LeatherButton } from '@app/ui/components/button';

interface SignMessageActionsProps {
  onSignMessage(): void;
  onSignMessageCancel(): void;
  isLoading: boolean;
}
export function SignMessageActions(props: SignMessageActionsProps) {
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

import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface CurrentStacksAccountLoaderProps {
  children(data: StacksAccount): React.ReactNode;
}
export function CurrentStacksAccountLoader({ children }: CurrentStacksAccountLoaderProps) {
  const currentAccount = useCurrentStacksAccount();
  if (!currentAccount) return null;
  return children(currentAccount);
}

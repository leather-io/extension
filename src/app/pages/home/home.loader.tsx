import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

interface HomeLoaderProps {
  children(data: StacksAccount): JSX.Element;
}
export function HomeLoader({ children }: HomeLoaderProps) {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return <FullPageLoadingSpinner />;
  return children(currentAccount);
}

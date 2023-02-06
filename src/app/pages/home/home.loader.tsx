import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { WalletAccount } from '@app/store/accounts/account.models';

interface HomeLoaderProps {
  children(data: WalletAccount): JSX.Element;
}
export function HomeLoader({ children }: HomeLoaderProps) {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return <FullPageLoadingSpinner />;
  return children(currentAccount);
}

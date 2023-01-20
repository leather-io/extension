import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { WalletAccount } from '@app/store/accounts/account.models';

interface HomeContainerProps {
  children(data: WalletAccount): JSX.Element;
}
export function HomeContainer({ children }: HomeContainerProps) {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return <FullPageLoadingSpinner />;
  return children(currentAccount);
}

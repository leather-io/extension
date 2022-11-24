import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { SkipFundAccountButton } from './components/skip-fund-account-button';
import { FundLayout } from './fund.layout';

interface FundPageLocationStateProps {
  state: { showSkipButton: boolean };
}
export function FundPage() {
  const { state } = useLocation() as FundPageLocationStateProps;
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  const isOnboarding = state?.showSkipButton;

  const onSkipFundAccount = () => navigate(RouteUrls.Home);

  useRouteHeader(
    <Header
      actionButton={
        isOnboarding ? <SkipFundAccountButton onSkipFundAccount={onSkipFundAccount} /> : undefined
      }
      hideActions={isOnboarding}
      onClose={isOnboarding ? undefined : () => navigate(RouteUrls.Home)}
      title={isOnboarding ? undefined : ' '}
    />
  );

  if (!currentAccount) return null;

  if (isOnboarding && balances?.stx.availableStx.amount.isGreaterThan(0))
    return <Navigate to={RouteUrls.Home} />;

  return (
    <>
      <FundLayout address={currentAccount.address} />
      <Outlet />
    </>
  );
}

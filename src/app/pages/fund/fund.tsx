import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import {
  useCurrentAccount,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { RouteUrls } from '@shared/route-urls';

import { FundLayout } from './fund.layout';
import { SkipFundAccountButton } from './components/skip-fund-account-button';

interface LocationStateProps {
  state: { showSkipButton: boolean };
}

export function FundPage() {
  const { state } = useLocation() as LocationStateProps;
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

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

  if (isOnboarding && availableStxBalance?.isGreaterThan(0))
    return <Navigate to={RouteUrls.Home} />;

  return (
    <>
      <FundLayout address={currentAccount.address} />
      <Outlet />
    </>
  );
}

import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import {
  useCurrentAccount,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { RouteUrls } from '@shared/route-urls';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useSkipFundAccount } from '@app/store/onboarding/onboarding.selectors';

import { FundLayout } from './fund.layout';
import { SkipFundAccountButton } from './components/skip-fund-account-button';

interface LocationStateProps {
  state: { showSkipButton: boolean };
}

export function FundPage() {
  const { state } = useLocation() as LocationStateProps;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentAccount = useCurrentAccount();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const hasSkippedFundAccount = useSkipFundAccount();

  const isOnboarding = state?.showSkipButton;

  const onSkipFundAccount = () => {
    dispatch(onboardingActions.userSkippedFundingAccount(true));
    navigate(RouteUrls.Home);
  };

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

  useEffect(() => {
    // This handles syncing b/w views, so it can likely be removed
    // once we force onboarding via full page view
    if (isOnboarding && hasSkippedFundAccount) navigate(RouteUrls.Home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

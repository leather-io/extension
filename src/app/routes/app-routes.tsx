import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Container } from '@app/components/container/container';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { SignTransaction } from '@app/pages/sign-transaction/sign-transaction';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { ReceiveTokens } from '@app/pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@app/pages/add-network/add-network';
import { SetPasswordPage } from '@app/pages/onboarding/set-password/set-password';
import { SendTokensForm } from '@app/pages/send-tokens/send-tokens';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { useSaveAuthRequest } from '@app/common/hooks/auth/use-save-auth-request-callback';
import { AccountGate } from '@app/routes/account-gate';
import { Unlock } from '@app/pages/unlock';
import { Home } from '@app/pages/home/home';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { BuyPage } from '@app/pages/buy/buy';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { useHasStateRehydrated } from '@app/store';
import { RouteUrls } from '@shared/route-urls';

import { useOnWalletLock } from './hooks/use-on-wallet-lock';
import { useOnSignOut } from './hooks/use-on-sign-out';
import { OnboardingGate } from './onboarding-gate';

export function AppRoutes(): JSX.Element | null {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  useSaveAuthRequest();

  useOnWalletLock(() => navigate(RouteUrls.Unlock));
  useOnSignOut(() => navigate(RouteUrls.Onboarding));

  useEffect(() => {
    void analytics.page('view', `${pathname}`);
  }, [analytics, pathname]);

  const hasStateRehydrated = useHasStateRehydrated();

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <Routes>
      <Route path={RouteUrls.Container} element={<Container />}>
        <Route
          path={RouteUrls.Home}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <Home />
              </Suspense>
            </AccountGate>
          }
        >
          <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
        </Route>
        <Route
          path={RouteUrls.Onboarding}
          element={
            <OnboardingGate>
              <WelcomePage />
            </OnboardingGate>
          }
        />
        <Route
          path={RouteUrls.BackUpSecretKey}
          element={
            <OnboardingGate>
              <BackUpSecretKeyPage />
            </OnboardingGate>
          }
        />
        <Route
          path={RouteUrls.SetPassword}
          element={
            <OnboardingGate>
              <SetPasswordPage />
            </OnboardingGate>
          }
        />
        <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsPage />} />
        <Route path={RouteUrls.SignIn} element={<SignIn />} />
        <Route path={RouteUrls.MagicRecoveryCode} element={<MagicRecoveryCode />} />
        <Route
          path={RouteUrls.AddNetwork}
          element={
            <AccountGate>
              <AddNetwork />
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.Buy}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <BuyPage />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ChooseAccount}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <ChooseAccount />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.Receive}
          element={
            <AccountGate>
              <ReceiveTokens />
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.Send}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner />}>
                <SendTokensForm />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.Transaction}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <SignTransaction />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ViewSecretKey}
          element={
            <AccountGate>
              <ViewSecretKey />
            </AccountGate>
          }
        />
        <Route path={RouteUrls.Unlock} element={<Unlock />} />
        {/* Catch-all route redirects to onboarding */}
        <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
      </Route>
    </Routes>
  );
}

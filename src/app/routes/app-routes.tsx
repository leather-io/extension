import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useWallet } from '@app/common/hooks/use-wallet';
import { getHasSetPassword } from '@shared/utils/storage';
import { Container } from '@app/components/container/container';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { SignTransaction } from '@app/pages/sign-transaction/sign-transaction';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { ReceiveTokens } from '@app/pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@app/pages/add-network/add-network';
import { SetPasswordPage } from '@app/pages/onboarding/set-password/set-password';
import { SendTokensForm } from '@app/pages/send-tokens/send-tokens-form';
import { SaveSecretKey } from '@app/pages/save-secret-key/save-secret-key';
import { useSaveAuthRequest } from '@app/common/hooks/auth/use-save-auth-request-callback';
import { AccountGate } from '@app/routes/account-gate';
import { Unlock } from '@app/pages/unlock';
import { Home } from '@app/pages/home/home';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { BuyPage } from '@app/pages/buy/buy';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { useVaultMessenger } from '@app/common/hooks/use-vault-messenger';
import { RouteUrls } from '@shared/route-urls';

import { useOnWalletLock } from './hooks/use-on-wallet-lock';
import { useOnSignOut } from './hooks/use-on-sign-out';

export function AppRoutes(): JSX.Element | null {
  const { hasRehydratedVault } = useWallet();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { getWallet } = useVaultMessenger();
  useSaveAuthRequest();

  useOnWalletLock(() => navigate(RouteUrls.Unlock));
  useOnSignOut(() => navigate(RouteUrls.Onboarding));

  useEffect(() => {
    const hasSetPassword = getHasSetPassword();
    const shouldRedirectToOnboarding =
      pathname === RouteUrls.Home ||
      (pathname === RouteUrls.ChooseAccount || pathname) === RouteUrls.Transaction;
    const shouldRedirectToHome = pathname === RouteUrls.Onboarding;
    // This ensures the route is correct bc the vault is slow to set wallet state
    if (shouldRedirectToOnboarding && !hasSetPassword) navigate(RouteUrls.Onboarding);
    if (shouldRedirectToHome && hasSetPassword) navigate(RouteUrls.Home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void analytics.page('view', `${pathname}`);
  }, [analytics, pathname]);

  useEffect(() => {
    void getWallet();
  }, [getWallet]);

  if (!hasRehydratedVault) return null;

  return (
    <Routes>
      <Route path={RouteUrls.Container} element={<Container />}>
        <Route
          path={RouteUrls.Home}
          element={
            <AccountGate>
              <Home />
            </AccountGate>
          }
        >
          <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
        </Route>
        <Route path={RouteUrls.Onboarding} element={<WelcomePage />} />
        <Route path={RouteUrls.BackUpSecretKey} element={<BackUpSecretKeyPage />} />
        <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsPage />} />
        <Route path={RouteUrls.SaveSecretKey} element={<SaveSecretKey />} />
        <Route path={RouteUrls.SetPassword} element={<SetPasswordPage />} />
        <Route path={RouteUrls.SignIn} element={<SignIn />} />
        <Route path={RouteUrls.RecoveryCode} element={<MagicRecoveryCode />} />
        <Route
          path={RouteUrls.AddNetwork}
          element={
            <AccountGate>
              <AddNetwork />
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
              <Suspense fallback={<LoadingSpinner />}>
                <SignTransaction />
              </Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ViewSecretKey}
          element={
            <AccountGate>
              <SaveSecretKey />
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

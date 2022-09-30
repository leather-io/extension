import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Container } from '@app/features/container/container';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { SignatureRequest } from '@app/pages/signature-request/signature-request';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { ReceiveTokens } from '@app/pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@app/pages/add-network/add-network';

import { SetPasswordPage } from '@app/pages/onboarding/set-password/set-password';
import { SendTokensForm } from '@app/pages/send-tokens/send-tokens';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';
import { Unlock } from '@app/pages/unlock';
import { Home } from '@app/pages/home/home';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { FundPage } from '@app/pages/fund/fund';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';

import { useHasStateRehydrated } from '@app/store';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';

import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { ledgerTxSigningRoutes } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.routes';
import { ledgerRequestKeysRoutes } from '@app/features/ledger/flows/request-keys/ledger-request-keys.routes';

import { useOnWalletLock } from './hooks/use-on-wallet-lock';
import { useOnSignOut } from './hooks/use-on-sign-out';
import { OnboardingGate } from './onboarding-gate';
import { ledgerMessageSigningRoutes } from '@app/features/ledger/flows/message-signing/ledger-sign-msg.routes';
import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { ProfileUpdaterRequest } from '@app/pages/update-profile-request/update-profile-request';

export function AppRoutes() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  useOnWalletLock(() => navigate(RouteUrls.Unlock));
  useOnSignOut(() => window.close());

  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

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
          <Route path={RouteUrls.IncreaseFee} element={<IncreaseFeeDrawer />}>
            {ledgerTxSigningRoutes}
          </Route>
          <Route path={RouteUrls.Receive} element={<ReceiveTokens />} />
          <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
          {ledgerTxSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.Onboarding}
          element={
            <OnboardingGate>
              <WelcomePage />
            </OnboardingGate>
          }
        >
          {ledgerRequestKeysRoutes}
        </Route>
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
          path={RouteUrls.ChooseAccount}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <ChooseAccount />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerJwtSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.Fund}
          element={
            <AccountGate>
              <Suspense fallback={<></>}>
                <FundPage />
              </Suspense>
            </AccountGate>
          }
        >
          <Route path={RouteUrls.FundReceive} element={<ReceiveTokens />} />
        </Route>
        <Route
          path={RouteUrls.Send}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner />}>
                <SendTokensForm />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerTxSigningRoutes}
          <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
        </Route>
        <Route
          path={RouteUrls.TransactionRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <TransactionRequest />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerTxSigningRoutes}
          <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
        </Route>
        <Route path={RouteUrls.UnauthorizedRequest} element={<UnauthorizedRequest />} />
        <Route
          path={RouteUrls.SignatureRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <SignatureRequest />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerMessageSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.ProfileUpdaterRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <ProfileUpdaterRequest />
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

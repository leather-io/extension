import { Suspense, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useNextTxNonce } from '@app/common/hooks/account/use-next-tx-nonce';
import { Container } from '@app/features/container/container';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { SignatureRequest } from '@app/pages/signature-request/signature-request';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { ReceiveTokens } from '@app/pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@app/pages/add-network/add-network';
import { ConnectLedgerRequestKeys } from '@app/features/ledger/flows/request-keys/steps/connect-ledger-request-keys';
import { ConnectLedgerRequestKeysError } from '@app/features/ledger/flows/request-keys/steps/connect-ledger-request-keys-error';
import { ConnectLedgerOnboardingSuccess } from '@app/features/ledger/flows/request-keys/steps/connect-ledger-request-keys-success';
import { LedgerDisconnected } from '@app/features/ledger/flows/tx-signing/steps/ledger-disconnected';
import { SetPasswordPage } from '@app/pages/onboarding/set-password/set-password';
import { SendTokensForm } from '@app/pages/send-tokens/send-tokens';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { useSaveAuthRequest } from '@app/common/hooks/auth/use-save-auth-request-callback';
import { AccountGate } from '@app/routes/account-gate';
import { Unlock } from '@app/pages/unlock';
import { Home } from '@app/pages/home/home';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { FundPage } from '@app/pages/fund/fund';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { LedgerRequestKeysContainer } from '@app/features/ledger/flows/request-keys/ledger-request-keys-container';
import { SignLedgerTransaction } from '@app/features/ledger/flows/tx-signing/steps/sign-ledger-transaction';
import { useHasStateRehydrated } from '@app/store';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { ConnectLedgerSignTxError } from '@app/features/ledger/flows/tx-signing/steps/connect-ledger-sign-tx-error';
import { ConnectLedgerSignTxSuccess } from '@app/features/ledger/flows/tx-signing/steps/connect-ledger-sign-tx-success';
import { LedgerSignTxContainer } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx-container';
import { ConnectLedgerSignTx } from '@app/features/ledger/flows/tx-signing/steps/connect-ledger-sign-tx';
import { LedgerTransactionRejected } from '@app/features/ledger/flows/tx-signing/steps/transaction-rejected';
import { LedgerPublicKeyMismatch } from '@app/features/ledger/flows/tx-signing/steps/public-key-mismatch';
import { VerifyingPublicKeysMatch } from '@app/features/ledger/flows/tx-signing/steps/verifying-public-keys-match';
import { PullingKeysFromDevice } from '@app/features/ledger/flows/request-keys/steps/pulling-keys-from-device';
import { UnsupportedBrowserLayout } from '@app/features/ledger/steps/unsupported-browser.layout';
import { LedgerSignJwtContainer } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt-container';
import { SignJwtHash } from '@app/features/ledger/flows/jwt-signing/steps/sign-jwt-hash';
import { ConnectLedgerSignJwt } from '@app/features/ledger/flows/jwt-signing/steps/connect-ledger-sign-jwt';
import { ConnectLedgerSignJwtError } from '@app/features/ledger/flows/jwt-signing/steps/connect-ledger-sign-jwt-error';
import { ConnectLedgerSignJwtSuccess } from '@app/features/ledger/flows/jwt-signing/steps/connect-ledger-sign-jwt-success';
import { LedgerJwtSigningRejected } from '@app/features/ledger/flows/jwt-signing/steps/transaction-rejected';
import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';

import { useOnWalletLock } from './hooks/use-on-wallet-lock';
import { useOnSignOut } from './hooks/use-on-sign-out';
import { OnboardingGate } from './onboarding-gate';

export function AppRoutes(): JSX.Element | null {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  useNextTxNonce();
  useSaveAuthRequest();

  useOnWalletLock(() => navigate(RouteUrls.Unlock));
  useOnSignOut(() => window.close());

  useEffect(() => {
    void analytics.page('view', `${pathname}`);
  }, [analytics, pathname]);

  const hasStateRehydrated = useHasStateRehydrated();

  const ledgerTxSigningRoutes = useMemo(
    () => (
      <Route element={<LedgerSignTxContainer />}>
        <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
        <Route path={RouteUrls.DeviceBusy} element={<VerifyingPublicKeysMatch />} />
        <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerSignTxError />} />
        <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSignTxSuccess />} />
        <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignLedgerTransaction />} />
        <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
        <Route path={RouteUrls.LedgerOperationRejected} element={<LedgerTransactionRejected />} />
        <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
        <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
      </Route>
    ),
    []
  );

  const ledgerJwtSigningRoutes = useMemo(
    () => (
      <Route element={<LedgerSignJwtContainer />}>
        <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignJwt />} />
        <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerSignJwtError />} />
        <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSignJwtSuccess />} />
        <Route path={RouteUrls.LedgerOperationRejected} element={<LedgerJwtSigningRejected />} />
        <Route path={RouteUrls.AwaitingDeviceUserAction} element={<SignJwtHash />} />
        <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
      </Route>
    ),
    []
  );

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
          <Route element={<LedgerRequestKeysContainer />}>
            <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerRequestKeys />} />
            <Route path={RouteUrls.DeviceBusy} element={<PullingKeysFromDevice />} />
            <Route
              path={RouteUrls.ConnectLedgerError}
              element={<ConnectLedgerRequestKeysError />}
            />
            <Route
              path={RouteUrls.LedgerUnsupportedBrowser}
              element={<UnsupportedBrowserLayout />}
            />
            <Route
              path={RouteUrls.ConnectLedgerSuccess}
              element={<ConnectLedgerOnboardingSuccess />}
            />
          </Route>
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
        />
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

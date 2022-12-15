import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BroadcastErrorDrawer } from '@app/components/broadcast-error-drawer/broadcast-error-drawer';
import { FullPageWithHeaderLoadingSpinner, LoadingSpinner } from '@app/components/loading-spinner';
import { Container } from '@app/features/container/container';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { ledgerMessageSigningRoutes } from '@app/features/ledger/flows/message-signing/ledger-sign-msg.routes';
import { ledgerRequestKeysRoutes } from '@app/features/ledger/flows/request-keys/ledger-request-keys.routes';
import { ledgerTxSigningRoutes } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.routes';
import { ThemesDrawer } from '@app/features/theme-drawer/theme-drawer';
import { AddNetwork } from '@app/pages/add-network/add-network';
import { AllowDiagnosticsPage } from '@app/pages/allow-diagnostics/allow-diagnostics';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { FundPage } from '@app/pages/fund/fund';
import { Home } from '@app/pages/home/home';
import { MessageSigningRequest } from '@app/pages/message-signing-request/message-signing-request';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { MagicRecoveryCode } from '@app/pages/onboarding/magic-recovery-code/magic-recovery-code';
import { SetPasswordPage } from '@app/pages/onboarding/set-password/set-password';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { ReceiveTokens } from '@app/pages/receive-tokens/receive-tokens';
import { SelectNetwork } from '@app/pages/select-network/select-network';
import { SendTokensForm } from '@app/pages/send-tokens/send-tokens';
import { ChooseCryptoAsset } from '@app/pages/send/choose-crypto-asset/choose-crypto-asset';
import { SendCryptoAssetForm } from '@app/pages/send/send-crypto-asset-form/send-crypto-asset-form';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { TransactionRequest } from '@app/pages/transaction-request/transaction-request';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { Unlock } from '@app/pages/unlock';
import { ProfileUpdateRequest } from '@app/pages/update-profile-request/update-profile-request';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';
import { useHasStateRehydrated } from '@app/store';
import { useHasUserRespondedToAnalyticsConsent } from '@app/store/settings/settings.selectors';

import { useOnSignOut } from './hooks/use-on-sign-out';
import { useOnWalletLock } from './hooks/use-on-wallet-lock';
import { OnboardingGate } from './onboarding-gate';

function AppRoutesAfterUserHasConsented() {
  const { pathname } = useLocation();

  const analytics = useAnalytics();

  useOnWalletLock(() => window.close());
  useOnSignOut(() => window.close());
  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

  const settingsModalRoutes = (
    <>
      <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
      <Route path={RouteUrls.ChangeTheme} element={<ThemesDrawer />} />
      <Route path={RouteUrls.SelectNetwork} element={<SelectNetwork />} />
    </>
  );

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
          <Route path={RouteUrls.IncreaseFee} element={<IncreaseFeeDrawer />}>
            {ledgerTxSigningRoutes}
          </Route>
          <Route path={RouteUrls.Receive} element={<ReceiveTokens />} />
          {settingsModalRoutes}
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
              <ChooseAccount />
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
              <Suspense fallback={<FullPageWithHeaderLoadingSpinner />}>
                <SendTokensForm />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerTxSigningRoutes}
          <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
          <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
        </Route>
        <Route
          path={RouteUrls.SendCryptoAsset}
          element={
            <AccountGate>
              <Suspense fallback={<FullPageWithHeaderLoadingSpinner />}>
                <ChooseCryptoAsset />
              </Suspense>
            </AccountGate>
          }
        />
        <Route path={RouteUrls.SendCryptoAssetForm} element={<SendCryptoAssetForm />}>
          <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
        </Route>
        <Route path={RouteUrls.SendCryptoAssetFormConfirmation} element={<>confirmation</>} />
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
          <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
          <Route path={RouteUrls.TransactionBroadcastError} element={<BroadcastErrorDrawer />} />
        </Route>
        <Route path={RouteUrls.UnauthorizedRequest} element={<UnauthorizedRequest />} />
        <Route
          path={RouteUrls.SignatureRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <MessageSigningRequest />
              </Suspense>
            </AccountGate>
          }
        >
          {ledgerMessageSigningRoutes}
        </Route>
        <Route
          path={RouteUrls.ProfileUpdateRequest}
          element={
            <AccountGate>
              <Suspense fallback={<LoadingSpinner height="600px" />}>
                <ProfileUpdateRequest />
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
        >
          {settingsModalRoutes}
        </Route>
        <Route path={RouteUrls.Unlock} element={<Unlock />}>
          {settingsModalRoutes}
        </Route>
        {/* Catch-all route redirects to onboarding */}
        <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
      </Route>
    </Routes>
  );
}

function AppRoutesBeforeUserHasConsented() {
  return (
    <Routes>
      <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsPage />} />
      <Route path="*" element={<Navigate replace to={RouteUrls.RequestDiagnostics} />} />
    </Routes>
  );
}

export function AppRoutes() {
  const hasStateRehydrated = useHasStateRehydrated();
  const hasResponded = useHasUserRespondedToAnalyticsConsent();

  if (!hasStateRehydrated) return <LoadingSpinner />;

  if (!hasResponded) return <AppRoutesBeforeUserHasConsented />;

  return <AppRoutesAfterUserHasConsented />;
}

import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { MagicRecoveryCode } from '@pages/onboarding/magic-recovery-code';
import { ChooseAccount } from '@pages/choose-account/choose-account';
import { SignTransaction } from '@pages/sign-transaction/sign-transaction';
import { Onboarding } from '@pages/onboarding/onboarding';
import { SignIn } from '@pages/onboarding/sign-in';
import { ReceiveTokens } from '@pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@pages/add-network/add-network';
import { SetPasswordPage } from '@pages/set-password';
import { SendTokensForm } from '@pages/send-tokens/send-tokens-form';
import { SaveSecretKey } from '@pages/save-secret-key/save-secret-key';
import { useSaveAuthRequest } from '@common/hooks/auth/use-save-auth-request-callback';
import { AccountGate } from '@routes/account-gate';
import { Unlock } from '@pages/unlock';
import { Home } from '@pages/home/home';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsPage } from '@pages/allow-diagnostics/allow-diagnostics';
import { BuyPage } from '@pages/buy/buy';
import { RouteUrls } from '@routes/route-urls';

export function AppRoutes(): JSX.Element {
  const { encryptedSecretKey, hasGeneratedWallet, hasSetPassword } = useWallet();
  const { pathname } = useLocation();
  const analytics = useAnalytics();
  useSaveAuthRequest();

  const hasOnboarded = (hasGeneratedWallet || encryptedSecretKey) && hasSetPassword;

  useEffect(() => {
    void analytics.page('view', `${pathname}`);
  }, [analytics, pathname]);

  return (
    <Routes>
      {/* TODO: Use a layout container route at highest level - remove PopupContainer */}
      {/* <Route element={<Layout />}> */}
      {hasOnboarded ? (
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
      ) : (
        <Route path={RouteUrls.Onboarding} element={<Onboarding />} />
      )}
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
            <Suspense fallback={<></>}>
              <SendTokensForm />
            </Suspense>
          </AccountGate>
        }
      />
      <Route
        path={RouteUrls.Transaction}
        element={
          <AccountGate>
            <Suspense fallback={<></>}>
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
      <Route path="*" element={<Onboarding />} />
    </Routes>
  );
}

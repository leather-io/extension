import React, { Suspense, useCallback, useEffect } from 'react';

import { Route, Routes, useLocation } from 'react-router-dom';

import { MagicRecoveryCode } from '@pages/install/magic-recovery-code';
import { Username } from '@pages/username';
import { ChooseAccount } from '@pages/choose-account/choose-account';
import { SignTransaction } from '@pages/sign-transaction/sign-transaction';
import { Installed } from '@pages/install';
import { InstalledSignIn } from '@pages/install/sign-in';

import { PopupReceive } from '@pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@pages/add-network/add-network';
import { SetPasswordPage } from '@pages/set-password';
import { SendTokensForm } from '@pages/send-tokens/send-tokens-form';

import { SaveYourKeyView } from '@pages/save-your-secret-key/save-your-key-view';
import { RouteUrls } from '@routes/route-urls';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useSaveAuthRequest } from '@common/hooks/auth/use-save-auth-request-callback';
import { Navigate } from '@components/navigate';
import { AccountGate } from '@routes/account-gate';
import { Unlock } from '@pages/unlock';
import { Home } from '@pages/home/home';
import { useUpdateLastSeenStore } from '@store/wallet/wallet.hooks';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';
import { AllowDiagnosticsFullPage } from '@pages/allow-diagnostics/allow-diagnostics';
import { BuyPage } from '@pages/buy/buy';

export function AppRoutes(): JSX.Element {
  const { isSignedIn: signedIn, encryptedSecretKey } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const { search, pathname } = useLocation();
  const setLastSeen = useUpdateLastSeenStore();

  const changeScreen = useChangeScreen();
  const analytics = useAnalytics();
  useSaveAuthRequest();

  const isSignedIn = signedIn && !isOnboardingInProgress;
  const isLocked = !signedIn && encryptedSecretKey;
  const [hasAllowedDiagnostics, _] = useHasAllowedDiagnostics();

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    void analytics.page('view', `${pathname}`);
  }, [analytics, pathname]);

  const getHomeComponent = useCallback(() => {
    if (hasAllowedDiagnostics === undefined) return <AllowDiagnosticsFullPage />;
    if (isSignedIn || encryptedSecretKey) {
      return (
        <AccountGate>
          <Home />
        </AccountGate>
      );
    }
    return <Installed />;
  }, [hasAllowedDiagnostics, isSignedIn, encryptedSecretKey]);

  const getSignInComponent = () => {
    if (isLocked) return <Unlock />;
    if (isSignedIn)
      return <Navigate to={RouteUrls.ChooseAccount} screenPath={RouteUrls.ChooseAccount} />;
    return <InstalledSignIn />;
  };

  const getSignUpElement = () => {
    if (isLocked) return <Unlock />;
    if (isSignedIn) {
      return (
        <Navigate to={`${RouteUrls.ChooseAccount}${search}`} screenPath={RouteUrls.ChooseAccount} />
      );
    }
    return <Installed />;
  };

  return (
    <Routes>
      <Route path={RouteUrls.Home} element={getHomeComponent()}>
        <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
      </Route>
      {/* Installation */}
      <Route path={RouteUrls.SignInInstalled} element={<InstalledSignIn />} />
      <Route
        path={RouteUrls.PopupHome}
        element={
          <AccountGate>
            <Home />
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
            <PopupReceive />
          </AccountGate>
        }
      />
      <Route
        path={RouteUrls.SettingsKey}
        element={
          <AccountGate>
            <SaveYourKeyView onClose={() => changeScreen(RouteUrls.Home)} title="Your Secret Key" />
          </AccountGate>
        }
      />
      <Route path={RouteUrls.AddNetwork} element={<AddNetwork />} />
      <Route path={RouteUrls.SetPassword} element={<SetPasswordPage redirect />} />
      <Route path={RouteUrls.Username} element={<Username />} />
      <Route path={RouteUrls.SignUp} element={getSignUpElement()} />
      {/* Sign In */}
      <Route path={RouteUrls.SignIn} element={getSignInComponent()} />
      <Route path={RouteUrls.RecoveryCode} element={<MagicRecoveryCode />} />
      <Route path={RouteUrls.AddAccount} element={<Username />} />;
      <Route
        path={RouteUrls.ChooseAccount}
        element={
          <Suspense fallback={<></>}>
            <ChooseAccount />
          </Suspense>
        }
      />
      {/* Transactions */}
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
    </Routes>
  );
}

import React, { Suspense, useCallback, useEffect } from 'react';

import { Route as RouterRoute, Routes as RoutesDom, useLocation } from 'react-router-dom';

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
import { ScreenPaths } from '@common/types';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useSaveAuthRequest } from '@common/hooks/auth/use-save-auth-request-callback';
import { Navigate } from '@components/navigate';
import { AccountGate } from '@pages/account-gate';
import { AccountGateRoute } from '@pages/account-gate-route';
import { Unlock } from '@pages/unlock';
import { Home } from '@pages/home/home';
import { useUpdateLastSeenStore } from '@store/wallet/wallet.hooks';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { useHasAllowedDiagnostics } from '@store/onboarding/onboarding.hooks';
import { AllowDiagnosticsFullPage } from '@pages/allow-diagnostics/allow-diagnostics';

interface RouteProps {
  path: ScreenPaths;
  element: React.ReactNode;
}

const Route: React.FC<RouteProps> = ({ path, element }) => {
  return <RouterRoute path={path} element={<>{element}</>} />;
};

export const Routes: React.FC = () => {
  const { isSignedIn: signedIn, encryptedSecretKey } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const { search, pathname } = useLocation();
  const setLastSeen = useUpdateLastSeenStore();

  const doChangeScreen = useChangeScreen();
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
      return <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />;
    return <InstalledSignIn />;
  };

  const getSignUpElement = () => {
    if (isLocked) return <Unlock />;
    if (isSignedIn) {
      return (
        <Navigate
          to={`${ScreenPaths.CHOOSE_ACCOUNT}${search}`}
          screenPath={ScreenPaths.CHOOSE_ACCOUNT}
        />
      );
    }
    return <Installed />;
  };

  return (
    <RoutesDom>
      <Route path={ScreenPaths.HOME} element={getHomeComponent()}>
        <Route path={ScreenPaths.SIGN_OUT_CONFIRM} element={<SignOutConfirmDrawer />} />
      </Route>
      {/* Installation */}
      <Route path={ScreenPaths.SIGN_IN_INSTALLED} element={<InstalledSignIn />} />
      <AccountGateRoute path={ScreenPaths.POPUP_HOME}>
        <Home />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.POPUP_SEND}>
        <SendTokensForm />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.POPUP_RECEIVE}>
        <PopupReceive />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.SETTINGS_KEY}>
        <SaveYourKeyView onClose={() => doChangeScreen(ScreenPaths.HOME)} title="Your Secret Key" />
      </AccountGateRoute>
      <RouterRoute path={ScreenPaths.ADD_NETWORK} element={<AddNetwork />} />
      <Route path={ScreenPaths.SET_PASSWORD} element={<SetPasswordPage redirect />} />
      <Route path={ScreenPaths.USERNAME} element={<Username />} />
      <Route path={ScreenPaths.GENERATION} element={getSignUpElement()} />
      {/*Sign In*/}
      <Route path={ScreenPaths.SIGN_IN} element={getSignInComponent()} />
      <Route path={ScreenPaths.RECOVERY_CODE} element={<MagicRecoveryCode />} />
      <Route path={ScreenPaths.ADD_ACCOUNT} element={<Username />} />;
      <Route
        path={ScreenPaths.CHOOSE_ACCOUNT}
        element={
          <Suspense fallback={<></>}>
            <ChooseAccount />
          </Suspense>
        }
      />
      {/* Transactions */}
      <AccountGateRoute path={ScreenPaths.TRANSACTION_POPUP}>
        <Suspense fallback={<></>}>
          <SignTransaction />
        </Suspense>
      </AccountGateRoute>
    </RoutesDom>
  );
};

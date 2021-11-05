import React, { useCallback, useEffect } from 'react';

import { Route as RouterRoute, Routes as RoutesDom, useLocation } from 'react-router-dom';

import { MagicRecoveryCode } from '@pages/install/magic-recovery-code';
import { Username } from '@pages/username';
import { ChooseAccount } from '@pages/choose-account/choose-account';
import { TransactionPage } from '@pages/transaction-signing/transaction-signing';
import { Installed } from '@pages/install';
import { InstalledSignIn } from '@pages/install/sign-in';

import { PopupReceive } from '@pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@pages/add-network/add-network';
import { SetPasswordPage } from '@pages/set-password';
import { SendTokensForm } from '@pages/send-tokens/send-tokens';

import { SaveYourKeyView } from '@pages/save-your-secret-key/save-your-key-view';
import { RouteUrls } from '@common/types';
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
import { AllowDiagnosticsDrawer } from '@pages/allow-diagnostics/allow-diagnostics';

interface RouteProps {
  path: RouteUrls;
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
  useSaveAuthRequest();

  const isSignedIn = signedIn && !isOnboardingInProgress;
  const isLocked = !signedIn && encryptedSecretKey;

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getHomeComponent = useCallback(() => {
    if (isSignedIn || encryptedSecretKey) {
      return (
        <AccountGate>
          <Home />
        </AccountGate>
      );
    }
    return <Installed />;
  }, [isSignedIn, encryptedSecretKey]);

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
    <>
      <div>
        <br />
        {pathname}
        <br />
      </div>
      <RoutesDom>
        <Route path={RouteUrls.Home} element={getHomeComponent()}>
          <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
          <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsDrawer />} />
        </Route>
        {/* Installation */}
        <Route path={RouteUrls.SignInInstalled} element={<InstalledSignIn />} />
        <AccountGateRoute path={RouteUrls.PopUpSend}>
          <React.Suspense fallback={<></>}>
            <SendTokensForm />
          </React.Suspense>
        </AccountGateRoute>
        <AccountGateRoute path={RouteUrls.PopUpReceive}>
          <PopupReceive />
        </AccountGateRoute>
        <AccountGateRoute path={RouteUrls.SettingsKey}>
          <SaveYourKeyView onClose={() => doChangeScreen(RouteUrls.Home)} title="Your Secret Key" />
        </AccountGateRoute>
        <RouterRoute path={RouteUrls.AddNetwork} element={<AddNetwork />} />
        <Route path={RouteUrls.SetPassword} element={<SetPasswordPage redirect />} />
        <Route path={RouteUrls.Username} element={<Username />} />
        <Route path={RouteUrls.SignUp} element={getSignUpElement()} />
        {/*Sign In*/}
        <Route path={RouteUrls.SignIn} element={getSignInComponent()} />
        <Route path={RouteUrls.RecoveryCode} element={<MagicRecoveryCode />} />
        <Route path={RouteUrls.AddAccount} element={<Username />} />;
        <Route
          path={RouteUrls.ChooseAccount}
          element={
            <React.Suspense fallback={<></>}>
              <ChooseAccount />
            </React.Suspense>
          }
        />
        {/* Transactions */}
        <AccountGateRoute path={RouteUrls.TransactionPopUp}>
          <TransactionPage />
        </AccountGateRoute>
      </RoutesDom>
    </>
  );
};

import React, { useEffect, useState } from 'react';

import { Route, Routes as RoutesDom, useLocation } from 'react-router-dom';

import { MagicRecoveryCode } from '@pages/install/magic-recovery-code';
import { Username } from '@pages/username';
import { ChooseAccount } from '@pages/choose-account/choose-account';
import { TransactionPage } from '@pages/transaction-signing/transaction-signing';
import { Installed } from '@pages/install';
import { InstalledEnterSecretKey } from '@pages/install/sign-in';

import { PopupReceive } from '@pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@pages/add-network/add-network';
import { SetPasswordPage } from '@pages/set-password';
import { Unlock } from '@pages/unlock';
import { SaveYourKeyView } from '@pages/save-your-secret-key/save-your-key-view';
import { RouteUrls } from '@common/types';

import { useSaveAuthRequest } from '@common/hooks/auth/use-save-auth-request-callback';
import { AccountGate } from '@pages/account-gate';
import { SignedOut } from '@pages/signed-out/signed-out-view';
import { Home } from '@pages/home/home';
import { useUpdateLastSeenStore } from '@store/wallet/wallet.hooks';
import { SignOutConfirmDrawer } from '@pages/sign-out-confirm/sign-out-confirm';
import { AllowDiagnosticsDrawer } from '@pages/allow-diagnostics/allow-diagnostics';
import { SendTokensForm } from '@pages/send-tokens/send-tokens';

export const Routes: React.FC = () => {
  // const { isSignedIn: signedIn, encryptedSecretKey } = useWallet();
  // const { isOnboardingInProgress } = useOnboardingState();
  const { pathname } = useLocation();
  const setLastSeen = useUpdateLastSeenStore();

  // This simulates a load period, during which the background script
  // has passed all the values to the popup script on load.
  // By returning null until then, the AccountGuard doesn't preemptively
  // navigate elsewhere. Not to be used in production, but helpful until
  // we find a nice way to check for "necessary info ready"
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 250);
  }, []);

  useSaveAuthRequest();

  // const isSignedIn = signedIn && !isOnboardingInProgress;
  // const isLocked = !signedIn && encryptedSecretKey;

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // const getSignInComponent = () => {
  //   if (isLocked) return <Navigate to={RouteUrls.Unlock} />;
  //   if (isSignedIn) return <Navigate to={RouteUrls.ChooseAccount} />;
  //   return <Navigate to={RouteUrls.InstalledRestoreKey} />;
  // };

  // const getSignUpElement = () => {
  //   if (isLocked) return <Navigate to={RouteUrls.Unlock} />;
  //   if (isSignedIn) {
  //     return <Navigate to={`${RouteUrls.ChooseAccount}${search}`} />;
  //   }
  //   return <Navigate to={RouteUrls.Installed} />;
  // };

  // To load a loading screen
  if (!hasLoaded) return null;

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 9, top: 0 }}>
        <br />
        {pathname}
        <br />
      </div>
      <RoutesDom>
        <Route
          path={RouteUrls.Home}
          element={
            <AccountGate>
              <Home />
            </AccountGate>
          }
        >
          <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
          <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsDrawer />} />
        </Route>
        <Route
          path={RouteUrls.SendTokens}
          element={
            <AccountGate>
              <React.Suspense fallback={<></>}>
                <SendTokensForm />
              </React.Suspense>
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ReceiveTokens}
          element={
            <AccountGate>
              <PopupReceive />
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.InstalledSaveKey}
          element={<SaveYourKeyView title="Your Secret Key" />}
        />
        <Route path={RouteUrls.SetPassword} element={<SetPasswordPage />} />
        <Route path={RouteUrls.AddNetwork} element={<AddNetwork />} />
        <Route path={RouteUrls.InstalledRestoreKey} element={<InstalledEnterSecretKey />} />
        <Route path={RouteUrls.Installed} element={<Installed />} />
        <Route path={RouteUrls.Username} element={<Username />} />
        <Route path={RouteUrls.RecoveryCode} element={<MagicRecoveryCode />} />
        <Route path={RouteUrls.AddAccount} element={<Username />} />;
        <Route
          path={RouteUrls.ChooseAccount}
          element={
            <React.Suspense fallback={<></>}>
              <AccountGate>
                <ChooseAccount />
              </AccountGate>
            </React.Suspense>
          }
        />
        <Route
          path={RouteUrls.SignTransaction}
          element={
            <AccountGate>
              <TransactionPage />
            </AccountGate>
          }
        />
        <Route path={RouteUrls.Unlock} element={<Unlock />} />;
        <Route path={RouteUrls.SignedOut} element={<SignedOut />} />;
      </RoutesDom>
    </>
  );
};

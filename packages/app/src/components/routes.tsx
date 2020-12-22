import React, { useEffect } from 'react';

import { Create, SaveKey } from '@pages/sign-up';
import { SignIn, DecryptRecoveryCode } from '@pages/sign-in';
import { Username } from '@pages/username';
import { SecretKey } from '@pages/secret-key';
import { ChooseAccount } from '@pages/connect';
import { TransactionPage } from '@pages/transaction';
import { Installed } from '@pages/install';
import { InstalledSignIn } from '@pages/install/sign-in';
import { PopupHome } from '@pages/popup';
import { PopupSend } from '@pages/popup/send';
import { PopupReceive } from '@pages/popup/receive';
import { AddNetwork } from '@pages/popup/add-network';
import { EditPostConditionsPage } from '@pages/transaction/edit-post-conditions';
import { SetPasswordPage } from '@pages/set-password';

import { ScreenPaths } from '@store/onboarding/types';
import { authenticationInit } from '@common/utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Routes as RoutesDom, Route, useLocation } from 'react-router-dom';
import { Navigate } from '@components/navigate';
import { AccountGate, AccountGateRoute } from '@components/account-gate';
import { lastSeenStore } from '@store/recoil/wallet';
import { useSetRecoilState } from 'recoil';

export const Routes: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  const { isSignedIn: signedIn, doFinishSignIn, doSaveAuthRequest } = useWallet();
  const { isOnboardingInProgress, onboardingPath } = useOnboardingState();
  const authRequest = authenticationInit();
  const { search, pathname } = useLocation();
  const setLastSeen = useSetRecoilState(lastSeenStore);
  const isSignedIn = signedIn && !isOnboardingInProgress;

  useEffect(() => {
    if (authRequest) {
      doSaveAuthRequest(authRequest);
    }
  }, [doSaveAuthRequest, authRequest]);

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getSignUpElement = () => {
    if (onboardingPath) {
      return <Navigate to={onboardingPath} screenPath={onboardingPath} />;
    }
    if (isSignedIn) {
      return (
        <Navigate
          to={{ pathname: '/', hash: `connect/choose-account?${search}` }}
          screenPath={ScreenPaths.CHOOSE_ACCOUNT}
        />
      );
    }
    return <Create next={() => doChangeScreen(ScreenPaths.SECRET_KEY)} />;
  };

  const getUsernameElement = () => {
    if (onboardingPath) {
      return <Username />;
    }
    if (isSignedIn) {
      return <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />;
    }
    return <Username />;
  };

  const getHomeComponent = () => {
    if (isSignedIn) {
      return <AccountGate element={<PopupHome />} />;
    }
    return <Installed />;
  };

  return (
    <RoutesDom>
      <Route path="/" element={getHomeComponent()} />
      {/* Installation */}
      <Route path="/installed" element={<Installed />} />
      <Route path="/installed/sign-in" element={<InstalledSignIn />} />
      <AccountGateRoute path={ScreenPaths.POPUP_HOME} element={<PopupHome />} />
      <AccountGateRoute path={ScreenPaths.SET_PASSWORD} element={<SetPasswordPage redirect />} />
      <AccountGateRoute path={ScreenPaths.POPUP_SEND} element={<PopupSend />} />
      <AccountGateRoute path={ScreenPaths.POPUP_RECEIVE} element={<PopupReceive />} />
      <AccountGateRoute path={ScreenPaths.ADD_NETWORK} element={<AddNetwork />} />
      <AccountGateRoute
        path={ScreenPaths.EDIT_POST_CONDITIONS}
        element={<EditPostConditionsPage />}
      />
      {/*Sign Up*/}
      <Route path="/sign-up" element={getSignUpElement()} />
      <Route
        path="/sign-up/secret-key"
        element={<SecretKey next={() => doChangeScreen(ScreenPaths.SAVE_KEY)} />}
      />
      <Route
        path="/sign-up/save-secret-key"
        element={
          <SaveKey
            next={() => {
              doChangeScreen(ScreenPaths.USERNAME);
            }}
          />
        }
      />
      <Route path="/sign-up/username" element={getUsernameElement()} />
      {/*Sign In*/}
      <Route
        path="/sign-in"
        element={
          isSignedIn ? (
            <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />
          ) : (
            <SignIn
              next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)}
              back={() => doChangeScreen(ScreenPaths.SECRET_KEY)}
            />
          )
        }
      />
      <Route
        path="/sign-in/recover"
        element={<DecryptRecoveryCode next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)} />}
      />
      <Route path="/sign-in/add-account" element={<Username />} />;
      <Route
        path="/connect/choose-account"
        element={
          <ChooseAccount
            next={(identityIndex: number) => {
              doFinishSignIn(identityIndex);
            }}
          />
        }
      />
      {/* Transactions */}
      <Route path="/transaction" element={<TransactionPage />} />
      {/*Error/Misc*/}
      <Route
        path="/settings/secret-key"
        element={<SecretKey next={() => doChangeScreen(ScreenPaths.HOME)} />}
      />
    </RoutesDom>
  );
};

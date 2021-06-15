import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, defaultState } from '@common/context';
import { AppConfig, UserSession } from '@stacks/auth';
import { AuthOptions } from '@stacks/connect';

export function useAuth() {
  const [state, setState] = useState<AppState>(defaultState());
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = useMemo(
    () => new AppConfig(['store_write', 'publish_data'], document.location.href),
    []
  );
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  const handleIsOnboarding = (isOnboarding: boolean) => setState({ ...state, isOnboarding });

  const handleSignOut = useCallback(() => {
    userSession.signUserOut();
    setState({ ...state, userData: null, isOnboarding: false });
  }, [userSession]);

  const handleRedirectAuth = useCallback(async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({ ...state, userData, isOnboarding: false });
      setAppPrivateKey(userData.appPrivateKey);
    } else if (userSession.isUserSignedIn()) {
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    }
  }, [userSession]);

  const onFinish = useCallback(({ userSession, authResponse }) => {
    const userData = userSession.loadUserData();
    setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    setAuthResponse(authResponse);
    setState({ ...state, userData, isOnboarding: false });
  }, []);

  const onCancel = useCallback(() => {
    console.log('popup closed!');
  }, []);

  useEffect(() => {
    void handleRedirectAuth();
    if (userSession.isUserSignedIn() && !state.userData) {
      const userData = userSession.loadUserData();
      setState({ ...state, userData, isOnboarding: false });
    }
  }, [handleRedirectAuth, userSession, state]);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    userSession,
    onFinish,
    onCancel,
    appDetails: {
      name: 'Testing App',
      icon: '/assets/messenger-app-icon.png',
    },
  };
  return {
    authOptions,
    state,
    authResponse,
    appPrivateKey,
    handleSignOut,
    handleIsOnboarding,
  };
}

import React, { useEffect, useContext } from 'react';
import { ThemeProvider, theme, Flex, CSSReset, Text } from '@blockstack/ui';
import { Connect, AuthOptions } from '@blockstack/connect';
import { WriteStatusCard } from '@cards/write-status';
import { AuthCard } from '@cards/auth';
import { getAuthOrigin } from '@common/utils';
import { HelloContractCard } from '@cards/hello-contract';
import { UserSession, AppConfig } from 'blockstack';
import { defaultState, AppContext, AppState } from '@common/context';
import { SignedIn } from '@cards/signed-in';
import { FaucetCard } from '@cards/faucet';

export const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>(defaultState);
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = new AppConfig(['store_write'], document.location.href);
  const userSession = new UserSession({ appConfig });

  const signOut = () => {
    userSession.signUserOut();
    setState({ userData: null });
  };

  const authOrigin = getAuthOrigin();
  const icon = `${document.location.href}/assets/messenger-app-icon.png`;

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setState({ userData });
    }
  }, []);

  const AppContent: React.FC = () => {
    const state = useContext(AppContext);

    return (
      <>
        <Text as="h2" fontSize={4} mt={6}>
          Authentication
        </Text>
        <Flex wrap="wrap" justifyContent="left">
          <AuthCard />
          {state.userData && <SignedIn signOut={signOut} />}
        </Flex>
        <Text as="h2" fontSize={5} mt={6}>
          Smart Contracts
        </Text>
        <Flex wrap="wrap" justifyContent="left">
          {state.userData ? (
            <>
              <FaucetCard />
              <HelloContractCard />
              <WriteStatusCard />
            </>
          ) : (
            <>
              <Text>Sign in or register to interact with smart contracts</Text>
            </>
          )}
        </Flex>
      </>
    );
  };

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    userSession,
    finished: ({ userSession, authResponse }) => {
      const userData = userSession.loadUserData();
      // setState(() => userData);
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      setState({ userData });
      console.log(userData);
    },
    authOrigin,
    appDetails: {
      name: 'Testing App',
      icon,
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={state}>
          <CSSReset />
          <Flex direction="column" minHeight="100vh" width="100vw" bg="whitesmoke" p={6}>
            {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
            {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

            <Text as="h1" fontSize={7}>
              Blockstack Kitchen Sink
            </Text>

            <AppContent />
          </Flex>
        </AppContext.Provider>
      </ThemeProvider>
    </Connect>
  );
};

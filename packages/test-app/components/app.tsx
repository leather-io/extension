import React, { useEffect, useContext } from 'react';
import { ThemeProvider, theme, Flex, CSSReset, Text, Box } from '@blockstack/ui';
import { Connect, AuthOptions } from '@blockstack/connect';
import { WriteStatusCard } from '@cards/write-status';
import { getAuthOrigin } from '@common/utils';
import { UserSession, AppConfig } from 'blockstack';
import { defaultState, AppContext, AppState } from '@common/context';
import { Faucet } from '@components/faucet';
// import { ContractDebugger } from '@components/contract-debugger';
import { Header } from '@components/header';
import { ReadStatusCard } from '@cards/read-status';
import { CounterActions } from '@components/counter-actions';
import { ExplorerLink } from '@components/explorer-link';
import { Deploy } from '@components/deploy';
import { STXTransfer } from '@components/stx-transfer';

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
      <Box p={6}>
        <Text as="h2" fontSize={5} mt={6}>
          Status Smart Contract
        </Text>
        <Text display="block" textStyle="caption.medium" maxWidth="600px" my={4}>
          Interact with a smart contract where anyone can write their &quot;status&quot;, and each
          STX address can have one status at a time. You can also fetch someone else&apos;s status,
          if you know their STX address.
        </Text>
        <ExplorerLink
          txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status"
          text="View contract in explorer"
          skipConfirmCheck
        />
        <Flex wrap="wrap" justifyContent="left" mb={6}>
          {state.userData ? (
            <>
              <WriteStatusCard />
              <ReadStatusCard />
            </>
          ) : (
            <>
              <Text textStyle="caption.medium" mb={3} display="block">
                Sign in or register to interact with smart contracts
              </Text>
            </>
          )}
        </Flex>
        <Text as="h2" fontSize={5} mt={6}>
          Counter Smart Contract
        </Text>
        <Text display="block" textStyle="caption.medium" maxWidth="600px" my={4}>
          Interact with a smart contract that keeps a single "counter" state variable. The public
          methods &quot;increment&quot; and &quot;decrement&quot; change the value of the counter.
        </Text>
        <ExplorerLink
          txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.counter"
          text="View contract in explorer"
          skipConfirmCheck
        />
        <CounterActions />
        <Faucet address={state.userData?.profile?.stxAddress} />
        <Deploy />
        <STXTransfer />
      </Box>
    );
  };

  const handleRedirectAuth = async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({ userData });
    }
  };

  React.useEffect(() => {
    handleRedirectAuth();
  }, []);

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
          <Flex direction="column" minHeight="100vh" bg="whitesmoke">
            {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
            {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

            <Header signOut={signOut} />

            <AppContent />
          </Flex>
        </AppContext.Provider>
      </ThemeProvider>
    </Connect>
  );
};

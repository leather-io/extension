import React, { useEffect, useContext } from 'react';
import { ThemeProvider, theme, Flex, CSSReset, Text, Button, Box } from '@blockstack/ui';
import { Connect, AuthOptions, useConnect } from '@blockstack/connect';
import { WriteStatusCard } from '@cards/write-status';
import { getAuthOrigin } from '@common/utils';
import { UserSession, AppConfig } from 'blockstack';
import { defaultState, AppContext, AppState } from '@common/context';
import { Faucet } from '@components/faucet';
import { ContractDebugger } from '@components/contract-debugger';
import { Header } from '@components/header';
import { ReadStatusCard } from '@cards/read-status';
import { SampleContracts } from '@common/contracts';

const Deploy = () => {
  const authOrigin = getAuthOrigin();
  const { doContractDeploy, userSession } = useConnect();
  const handleSubmit = async () =>
    doContractDeploy({
      authOrigin,
      contractSource: SampleContracts[0].contractSource,
      contractName: SampleContracts[0].contractName,
      userSession,
      finished: data => {
        console.log('finished!', data);
      },
    });
  return (
    <Box>
      <Button onClick={handleSubmit}>Deploy</Button>
    </Box>
  );
};

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
        <Faucet address={state.userData?.profile?.stxAddress} />
        {state.userData ? <Deploy /> : null}
        <Text as="h2" fontSize={5} mt={6}>
          Smart Contracts
        </Text>
        <Text display="block" textStyle="caption.medium" maxWidth="600px" my={4}>
          Interact with a pre-existing smart contract. Anyone can write their &quot;status&quot;, and each STX address
          can have one status at a time. You can also fetch someone else&apos;s status, if you know their STX address.
        </Text>
        <Flex wrap="wrap" justifyContent="left">
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
          Contract Debugger
        </Text>
        <Text display="block" my={4} textStyle="caption.medium" maxWidth="600px">
          Enter the information for any published smart contract. That contract&apos;s interface and source code will be
          fetched, and you&apos;ll be able to execute public and read-only functions on that contract.
        </Text>
        <ContractDebugger />
      </Box>
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

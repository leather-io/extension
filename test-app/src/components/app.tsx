import React from 'react';

import { AppContext } from '@common/context';
import { useAuth } from '@common/use-auth';
import { Header } from '@components/header';
import { Home } from '@components/home';
import { Connect } from '@stacks/connect-react';
import { Flex, ThemeProvider, theme } from '@stacks/ui';

export const App: React.FC = () => {
  const { authOptions, state, authResponse, appPrivateKey, handleSignOut } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Connect authOptions={authOptions}>
        <AppContext.Provider value={state}>
          <Flex width="100%" flexDirection="column" minHeight="100vh" bg="white">
            {/*These are for tests*/}
            {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
            {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}
            <Header signOut={handleSignOut} />
            <Home />
          </Flex>
        </AppContext.Provider>
      </Connect>
    </ThemeProvider>
  );
};

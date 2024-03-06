import React from 'react';

import { AppContext } from '@common/context';
import { useAuth } from '@common/use-auth';
import { Header } from '@components/header';
import { Home } from '@components/home';
import { Connect } from '@stacks/connect-react';
import { Flex } from 'leather-styles/jsx';

export const App: React.FC = () => {
  const { authOptions, state, authResponse, appPrivateKey, handleSignOut } = useAuth();

  return (
    <Connect authOptions={authOptions}>
      <AppContext.Provider value={state}>
        <Flex width="100%" flexDirection="column" minHeight="100vh" bg="white">
          {/*These are for tests*/}
          {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
          {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}
          <Header signOut={handleSignOut} />
          <iframe src="chrome-extension://kepoednijakempabkblheecenlndgdmb/index.html#/unlock" />
          <Home />
        </Flex>
      </AppContext.Provider>
    </Connect>
  );
};

import React from 'react';

import { AppContext } from '@common/context';
import { useAuth } from '@common/use-auth';
import { Home } from '@components/home';
import { Connect } from '@stacks/connect-react-jwt';
import { Box, styled } from 'leather-styles/jsx';
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
          <styled.nav justifyContent="space-between" alignItems="center" height="64px" px={6}>
            {state.userData ? (
              <Box>
                <styled.a
                  ml={2}
                  textStyle="caption.medium"
                  color="blue"
                  onClick={() => {
                    handleSignOut();
                  }}
                >
                  Sign out
                </styled.a>
              </Box>
            ) : null}
          </styled.nav>
          <Home />
        </Flex>
      </AppContext.Provider>
    </Connect>
  );
};

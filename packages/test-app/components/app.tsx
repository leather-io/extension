import React from 'react';
import { ThemeProvider, theme, Flex, CSSReset, Text } from '@blockstack/ui';
import { Connect, AuthOptions } from '@blockstack/connect';
import { WriteStatusCard } from '@cards/write-status';
import { AuthCard } from '@cards/auth';
import { getAuthOrigin } from '@common/utils';
import { HelloContractCard } from '@cards/hello-contract';
import { SignedIn } from '@cards/signed-in';

const AppContent: React.FC = () => {
  return (
    <Flex wrap="wrap" justifyContent="space-between">
      <HelloContractCard />
      <AuthCard />
      <WriteStatusCard />
    </Flex>
  );
};

interface AppState {
  [key: string]: any;
}

export const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>({});
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const authOrigin = getAuthOrigin();
  const icon = `${document.location.href}/assets/messenger-app-icon.png`;

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    finished: ({ userSession, authResponse }) => {
      const userData = userSession.loadUserData();
      setState(() => userData);
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      console.log(userData);
    },
    authOrigin,
    appDetails: {
      name: 'Testing App',
      icon,
    },
  };

  const handleSignOut = () => {
    setState({});
  };
  const isSignedIn = (state && state.identityAddress) || undefined;
  return (
    <Connect authOptions={authOptions}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Flex direction="column" minHeight="100vh" width="100vw" bg="whitesmoke" p={6}>
          {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
          {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

          <Text as="h1">Blockstack Kitchen Sink</Text>

          {!isSignedIn ? <AppContent /> : <SignedIn handleSignOut={handleSignOut} username={state.username} />}
        </Flex>
      </ThemeProvider>
    </Connect>
  );
};

import { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';

import { theme } from '@app/common/theme';
import { GlobalStyles } from '@app/components/global-styles/global-styles';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { AccountsDrawer } from '@app/features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@app/features/network-drawer/networks-drawer';
import { SettingsDropdown } from '@app/features/settings-dropdown/settings-dropdown';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';
import { Devtools } from '@app/features/devtool/devtools';
import { AppRoutes } from '@app/routes/app-routes';
import { persistor, store } from '@app/store';
import { jotaiWrappedReactQueryQueryClient as queryClient } from '@app/store/common/common.hooks';

const reactQueryDevToolsEnabled = false;

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<FullPageLoadingSpinner />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            <ColorModeProvider defaultMode="light">
              <Suspense fallback={<FullPageLoadingSpinner />}>
                <Router>
                  <AppErrorBoundary>
                    <AppRoutes />
                    <AccountsDrawer />
                    <NetworksDrawer />
                    <EditNonceDrawer />
                    <IncreaseFeeDrawer />
                    <SettingsDropdown />
                  </AppErrorBoundary>
                  <Toaster
                    position="bottom-center"
                    toastOptions={{ style: { fontSize: '14px' } }}
                  />
                </Router>
                {reactQueryDevToolsEnabled && <Devtools />}
              </Suspense>
            </ColorModeProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

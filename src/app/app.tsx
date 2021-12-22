import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { HashRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { AccountsDrawer } from '@app/features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@app/features/network-drawer/networks-drawer';
import { SettingsDropdown } from '@app/features/settings-dropdown/settings-dropdown';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@app/features/increase-fee-drawer/increase-fee-drawer';
import { Devtools } from '@app/features/devtool/devtools';
import { jotaiWrappedReactQueryQueryClient as queryClient } from '@app/store/common/common.hooks';
import { initSegment } from './common/segment-init';
import { theme } from './common/theme';
import { GlobalStyles } from './components/styles/global-styles';
import { AppRoutes } from './routes/app-routes';

const devToolsEnabled = false;

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;

void initSegment();

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider defaultMode="light">
          <>
            <Router>
              <AppErrorBoundary>
                <AppRoutes />
                <AccountsDrawer />
                <NetworksDrawer />
                <EditNonceDrawer />
                <IncreaseFeeDrawer />
                <SettingsDropdown />
              </AppErrorBoundary>
              <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
            </Router>
            {devToolsEnabled && <Devtools />}
          </>
        </ColorModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

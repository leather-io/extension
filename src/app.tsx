import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { HashRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { theme } from '@common/theme';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from '@features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@features/network-drawer/networks-drawer';
import { SettingsDropdown } from '@features/settings-dropdown/settings-dropdown';
import { AppErrorBoundary } from '@features/errors/app-error-boundary';
import { EditNonceDrawer } from '@features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@features/increase-fee-drawer/increase-fee-drawer';
import { Devtools } from '@features/devtool/devtools';
import { initSegment } from '@common/segment-init';
import { AppRoutes } from '@routes/app-routes';
import { jotaiWrappedReactQueryQueryClient as queryClient } from '@store/common/common.hooks';

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
                <VaultLoader />
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

import React from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { HashRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { theme } from '@common/theme';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from '@features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@features/network-drawer/networks-drawer';
import { SettingsPopover } from '@features/settings-dropdown/settings-popover';
import { AppErrorBoundary } from '@features/errors/app-error-boundary';
import { EditNonceDrawer } from '@features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseFeeDrawer } from '@features/increase-fee-drawer/increase-fee-drawer';
import { Devtools } from '@features/devtool/devtools';
import { initSegment } from '@common/segment-init';
import { jotaiWrappedReactQueryQueryClient as queryClient } from '@store/common/common.hooks';

import { Routes } from './routes';

const devToolsEnabled = false;

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;
void initSegment();

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider defaultMode="light">
          <>
            <Router>
              <AppErrorBoundary>
                <VaultLoader />
                <Routes />
                <AccountsDrawer />
                <NetworksDrawer />
                <EditNonceDrawer />
                <IncreaseFeeDrawer />
                <SettingsPopover />
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

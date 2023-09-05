import { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { ThemeProvider } from '@stacks/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@app/common/persistence';
import { theme } from '@app/common/theme';
import { GlobalStyles } from '@app/components/global-styles/global-styles';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { Devtools } from '@app/features/devtool/devtools';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { AppRoutes } from '@app/routes/app-routes';
import { persistor, store } from '@app/store';

import { ElectrumClientProvider } from './common/electrum/provider';
import { ThemeSwitcherProvider } from './common/theme-provider';
import { HeadProvider } from './features/html-head/head-provider';
import './index.css';

const reactQueryDevToolsEnabled = process.env.REACT_QUERY_DEVTOOLS_ENABLED === 'true';

export function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<FullPageLoadingSpinner />} persistor={persistor}>
        <HeadProvider />
        <ThemeProvider theme={theme}>
          <ThemeSwitcherProvider>
            <GlobalStyles />
            <QueryClientProvider client={queryClient}>
              <ElectrumClientProvider>
                <Suspense fallback={<FullPageLoadingSpinner />}>
                  <AppErrorBoundary>
                    <AppRoutes />
                  </AppErrorBoundary>
                  {reactQueryDevToolsEnabled && <Devtools />}
                </Suspense>
              </ElectrumClientProvider>
            </QueryClientProvider>
          </ThemeSwitcherProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

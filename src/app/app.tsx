import { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { radixBaseCSS } from '@radix-ui/themes/styles.css';
import { ThemeProvider } from '@stacks/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@app/common/persistence';
import { theme } from '@app/common/theme';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { Devtools } from '@app/features/devtool/devtools';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { AppRoutes } from '@app/routes/app-routes';
import { persistor, store } from '@app/store';

import { ThemeSwitcherProvider } from './common/theme-provider';
import { HeadProvider } from './features/html-head/head-provider';
import './index.css';

const reactQueryDevToolsEnabled = process.env.REACT_QUERY_DEVTOOLS_ENABLED === 'true';

export function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<FullPageLoadingSpinner />} persistor={persistor}>
        <HeadProvider />
        {/* TODO: this works but investigate importing radixBaseCSS in panda layer config */}
        <ThemeProvider theme={theme} css={radixBaseCSS}>
          <ThemeSwitcherProvider>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<FullPageLoadingSpinner />}>
                <AppErrorBoundary>
                  <AppRoutes />
                </AppErrorBoundary>
                {reactQueryDevToolsEnabled && <Devtools />}
              </Suspense>
            </QueryClientProvider>
          </ThemeSwitcherProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

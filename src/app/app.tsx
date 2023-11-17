import { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { radixBaseCSS } from '@radix-ui/themes/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { styled } from 'leather-styles/jsx';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@app/common/persistence';
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
        <ThemeSwitcherProvider>
          <styled.div css={radixBaseCSS}>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<FullPageLoadingSpinner />}>
                <AppErrorBoundary>
                  <AppRoutes />
                </AppErrorBoundary>
                {reactQueryDevToolsEnabled && <Devtools />}
              </Suspense>
            </QueryClientProvider>
          </styled.div>
        </ThemeSwitcherProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

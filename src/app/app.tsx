import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';

import { QueryClientProvider } from '@tanstack/react-query';
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
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { fontSize: '14px' },
          }}
        />
      </PersistGate>
    </ReduxProvider>
  );
}

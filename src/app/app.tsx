import { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { MantineProvider, Text } from '@mantine/core';
import { ColorModeProvider as ColorModeProviderLegacy, ThemeProvider } from '@stacks/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@app/common/persistence';
import { theme } from '@app/common/theme';
import { GlobalStyles } from '@app/components/global-styles/global-styles';
import { FullPageLoadingSpinner, NewAccountLoadingSpinner } from '@app/components/loading-spinner';
import { Devtools } from '@app/features/devtool/devtools';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { AppRoutes } from '@app/routes/app-routes';
import { persistor, store } from '@app/store';

import { ThemeSwitcherProvider } from './common/theme-provider';

const reactQueryDevToolsEnabled = process.env.REACT_QUERY_DEVTOOLS_ENABLED === 'true';

const ColorModeProvider = ColorModeProviderLegacy as any;

// interface Breakpoints extends Array<string> {
//   sm?: string;
//   md?: string;
//   lg?: string;
//   xl?: string;
// }

// let breakpoints: Breakpoints = ['600px', '960px', '1280px', '1920px'];

// breakpoints = {
//   ...breakpoints,
//   ...{
//     sm: breakpoints[0],
//     md: breakpoints[1],
//     lg: breakpoints[2],
//     xl: breakpoints[3],
//   },
// };

export function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<FullPageLoadingSpinner />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ThemeSwitcherProvider>
            <GlobalStyles />
            <QueryClientProvider client={queryClient}>
              <ColorModeProvider defaultMode="light">
                <Suspense fallback={<NewAccountLoadingSpinner />}>
                  <AppErrorBoundary>
                    {/* <AppRoutes /> */}
                    {/* <MantineProvider
                      withGlobalStyles
                      withNormalizeCSS
                      // theme={{
                      //   breakpoints: {
                      //     0: '30em',
                      //     1: '40em',
                      //     sm: '30em',
                      //   },
                      // }}
                    >
                      <Text>Welcome to Mantine!</Text> */}

                    <AppRoutes />
                    {/* </MantineProvider> */}
                  </AppErrorBoundary>
                  {reactQueryDevToolsEnabled && <Devtools />}
                </Suspense>
              </ColorModeProvider>
            </QueryClientProvider>
          </ThemeSwitcherProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

// notes
/**
 *  probably need to take out this styled-system theme-get from package.json
 * its from https://www.npmjs.com/package/@styled-system/theme-get
 * https://www.npmjs.com/~jxnblk who I think worked on stacks UI?
 *
 * Adding Mantine to wrap the APP here makes it crash as the current breakpoints expect an array but in Mantine its an object
 *  https://github.com/styled-system/styled-system/issues/1318
 *
 *
 * I tried to rip all stacks wrapping out but it seems like it will take some work
 *
 * can hack out breakpoints.map from index but not really ideal to do that
 */

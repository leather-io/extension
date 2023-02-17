import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import { PERSISTENCE_CACHE_TIME } from '@shared/constants';
import { IS_TEST_ENV } from '@shared/environment';

const localStoragePersistor = createSyncStoragePersister({ storage: window.localStorage });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: PERSISTENCE_CACHE_TIME,
      // https://tanstack.com/query/v4/docs/guides/testing#turn-off-retries
      retry: IS_TEST_ENV ? false : 3,
    },
  },
});

export async function persistAndRenderApp(renderApp: () => void) {
  if (!IS_TEST_ENV)
    persistQueryClient({
      queryClient,
      persister: localStoragePersistor,
      buster: VERSION,
    });
  renderApp();
}

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

import { PERSISTENCE_CACHE_TIME } from '@leather.io/constants';

import { IS_TEST_ENV } from '@shared/environment';
import { logger } from '@shared/logger';
import { analytics } from '@shared/utils/analytics';

const storage = {
  getItem: async (key: string) => {
    const storageVal = await chrome.storage.local.get(key);
    return storageVal[key];
  },
  setItem: (key: string, value: string) => chrome.storage.local.set({ [key]: value }),
  removeItem: (key: string) => chrome.storage.local.remove([key]),
};

const chromeStorageLocalPersister = createAsyncStoragePersister({ storage });

function isZodError(error: Error): error is ZodError {
  // `instanceof` check doesn't work when ZodError thrown from within a package
  return error instanceof ZodError || error.name === 'ZodError';
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      if (isAxiosError(error)) {
        const errorReport = {
          statusCode: error.response?.status,
          query: query.queryKey[0],
          hash: query.queryHash,
          error: error.toJSON(),
        };
        void analytics.untypedTrack('api_error', errorReport);
      }

      if (isZodError(error)) {
        const zodErrorReport = {
          query: query.queryKey[0],
          hash: query.queryHash,
          error: JSON.stringify(error.issues),
        };
        logger.error('schema_fail', zodErrorReport);
        // Replace with `formatQueryZodErrors` from `@leather.io/query`
        // Example:
        // `void analytics.track(...formatQueryZodErrors(error, query))`
        void analytics.track('schema_fail', zodErrorReport);
      }
    },
  }),
  defaultOptions: {
    queries: {
      gcTime: PERSISTENCE_CACHE_TIME,
      // https://tanstack.com/query/v4/docs/guides/testing#turn-off-retries
      retry: IS_TEST_ENV ? false : 3,
    },
  },
});

export async function persistAndRenderApp(renderApp: () => void) {
  if (!IS_TEST_ENV) {
    void persistQueryClient({
      queryClient,
      persister: chromeStorageLocalPersister,
      buster: VERSION,
    });
  }
  renderApp();
}

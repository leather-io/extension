import { QueryClient } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';

import { PERSISTENCE_CACHE_TIME } from '@shared/constants';
import { IS_TEST_ENV } from '@shared/environment';

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: PERSISTENCE_CACHE_TIME,
      notifyOnChangeProps: ['data', 'error'],
    },
  },
});

export async function persistAndRenderApp(renderApp: () => void) {
  if (!IS_TEST_ENV)
    await persistQueryClient({
      queryClient,
      persistor: localStoragePersistor,
      buster: VERSION,
    });
  renderApp();
}

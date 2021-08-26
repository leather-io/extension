import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { queryClient } from 'jotai-query-toolkit';
import { IS_TEST_ENV, PERSISTENCE_CACHE_TIME } from '@common/constants';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

queryClient.setDefaultOptions({
  queries: {
    cacheTime: PERSISTENCE_CACHE_TIME,
    notifyOnChangeProps: ['data', 'error'],
  },
});

export async function persistAndRenderApp(renderApp: () => void) {
  if (!IS_TEST_ENV)
    await persistQueryClient({
      queryClient,
      persistor: localStoragePersistor,
    });
  renderApp();
}

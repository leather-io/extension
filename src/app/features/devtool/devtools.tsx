import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { queryClient } from '@app/common/persistence';

export function Devtools() {
  return queryClient ? (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position={'bottom-left'} />
    </QueryClientProvider>
  ) : null;
}

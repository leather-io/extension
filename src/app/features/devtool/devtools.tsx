import { useClientQuery } from '@app/store/devtool/devtool.hooks';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

export function Devtools() {
  const client = useClientQuery();
  return client ? (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools position={'top-left'} />
    </QueryClientProvider>
  ) : null;
}

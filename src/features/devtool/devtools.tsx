import React from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';
import { useAtomValue } from 'jotai/utils';
import { queryClientAtom } from 'jotai-query-toolkit';

export function Devtools() {
  const client = useAtomValue(queryClientAtom);
  return client ? (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools position={'top-left'} />
    </QueryClientProvider>
  ) : null;
}

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Box } from 'leather-styles/jsx/box';

import { queryClient } from '@app/common/persistence';

export function Devtools() {
  return queryClient ? (
    <QueryClientProvider client={queryClient}>
      <Box fontSize="16px">
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </Box>
    </QueryClientProvider>
  ) : null;
}

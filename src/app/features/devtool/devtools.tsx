import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { styled } from 'leather-styles/jsx';

import { queryClient } from '@app/common/persistence';

export function Devtools() {
  if (!queryClient) return null;
  return (
    // Default font-size is tiny, this forces the dev tools to be sized relative
    // to our interface.
    <styled.div fontSize="16px">
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </styled.div>
  );
}

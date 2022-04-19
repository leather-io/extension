import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useAccountRequestSearchParams() {
  const [searchParams] = useSearchParams();

  return useMemo(
    () => ({
      tabId: searchParams.get('tabId'),
      id: searchParams.get('id'),
      origin: searchParams.get('origin'),
    }),
    [searchParams]
  );
}

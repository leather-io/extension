import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useLatestLedgerError() {
  const location = useLocation();

  return useMemo(() => {
    const state = location.state;
    if (!state || state === null) return null;
    if (typeof state === 'object') {
      const error = (state as any).latestLedgerError;
      if (error) return error;
    }
    return null;
  }, [location.state]);
}

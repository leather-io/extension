import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const immediatelyAttemptLedgerConnection = 'immediatelyAttemptLedgerConnection' as const;

export function useWhenReattemptingLedgerConnection(fn: () => void) {
  const location = useLocation();

  useEffect(() => {
    const state: any = location.state;
    if (typeof state !== 'object' || state === null) return;
    if (state[immediatelyAttemptLedgerConnection]) fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

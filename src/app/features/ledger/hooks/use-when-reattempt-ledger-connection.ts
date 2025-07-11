import { useLocation } from 'react-router';

import { useOnMount } from '@app/common/hooks/use-on-mount';

export const immediatelyAttemptLedgerConnection = 'immediatelyAttemptLedgerConnection';

export function useWhenReattemptingLedgerConnection(fn: () => void) {
  const location = useLocation();

  useOnMount(() => {
    const state: any = location.state;
    if (typeof state !== 'object' || state === null) return;
    if (state[immediatelyAttemptLedgerConnection]) {
      // hack to call function on mount
      setTimeout(fn);
    }
  });
}

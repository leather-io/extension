import { useEffect } from 'react';

import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';

export function useOnWalletLock(handler: () => void) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message?.method === inMemoryKeyActions.lockWallet.type) handler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

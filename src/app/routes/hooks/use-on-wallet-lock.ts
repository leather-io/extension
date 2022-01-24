import { useEffect } from 'react';

import { keyActions } from '@app/store/keys/key.actions';

export function useOnWalletLock(handler: () => void) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message?.method === keyActions.lockWallet.type) handler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

import { useEffect } from 'react';

import { InternalMethods } from '@shared/message-types';

export function useOnWalletLock(handler: () => void) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message.method === InternalMethods.lockWallet) handler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

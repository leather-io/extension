import { useEffect } from 'react';

import { keyActions } from '@app/store/keys/key.actions';

export function useOnSignOut(handler: () => void) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message?.method === keyActions.signOut.type) handler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

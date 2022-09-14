import { keyActions } from '@app/store/keys/key.actions';
import { useOnMount } from '@app/common/hooks/use-on-mount';

export function useOnSignOut(handler: () => void) {
  useOnMount(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message?.method === keyActions.signOut.type) handler();
    });
  });
}

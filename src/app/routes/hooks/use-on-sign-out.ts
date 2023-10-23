import { useOnMount } from '@app/common/hooks/use-on-mount';
import { keyActions } from '@app/store/software-keys/software-key.actions';

export function useOnSignOut(handler: () => void) {
  useOnMount(() => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.method === keyActions.signOut.type) handler();
      sendResponse();
    });
  });
}

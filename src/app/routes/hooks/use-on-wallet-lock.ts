import { useOnMount } from '@app/common/hooks/use-on-mount';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';

export function useOnWalletLock(handler: () => void) {
  useOnMount(() => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.method === inMemoryKeyActions.lockWallet.type) handler();
      sendResponse();
    });
  });
}

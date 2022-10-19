import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import { useOnMount } from '@app/common/hooks/use-on-mount';

export function useOnWalletLock(handler: () => void) {
  useOnMount(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message?.method === inMemoryKeyActions.lockWallet.type) handler();
    });
  });
}

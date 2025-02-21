import { InternalMethods } from '@shared/message-types';
import type { BackgroundMessages } from '@shared/messages';

import { useOnMount } from '@app/common/hooks/use-on-mount';

export function useOnChangeAccount(handler: (accountIndex: number) => void) {
  useOnMount(() => {
    chrome.runtime.onMessage.addListener((message: BackgroundMessages, _sender, sendResponse) => {
      if (message?.method === InternalMethods.AccountChanged) handler(message.payload.accountIndex);
      sendResponse();
    });
  });
}

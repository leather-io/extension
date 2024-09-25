import { useEffect } from 'react';

import { InternalMethods } from '@shared/message-types';
import { BackgroundMessages } from '@shared/messages';
import { analytics } from '@shared/utils/analytics';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function useOnOriginTabClose(handler: () => void) {
  const { tabId } = useDefaultRequestParams();

  useEffect(() => {
    const messageHandler = (
      message: BackgroundMessages,
      _sender: chrome.runtime.MessageSender,
      sendResponse: () => void
    ) => {
      if (message.method !== InternalMethods.OriginatingTabClosed) return;

      if (message.payload.tabId === tabId) {
        handler();
        void analytics.track('requesting_origin_tab_closed_with_pending_action');
      }
      sendResponse();
    };

    chrome.runtime.onMessage.addListener(messageHandler);

    return () => chrome.runtime.onMessage.removeListener(handler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

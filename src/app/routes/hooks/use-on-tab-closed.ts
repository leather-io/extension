import { useEffect } from 'react';

import { InternalMethods } from '@shared/message-types';
import { BackgroundMessages } from '@shared/messages';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function useOnOriginTabClose(handler: () => void) {
  const { tabId } = useDefaultRequestParams();
  const analytics = useAnalytics();

  useEffect(() => {
    const messageHandler = (message: BackgroundMessages) => {
      if (message.method !== InternalMethods.OriginatingTabClosed) return;
      if (message.payload.tabId === tabId) {
        handler();
        void analytics.track('requesting_origin_tab_closed_with_pending_action');
      }
    };

    chrome.runtime.onMessage.addListener(messageHandler);

    return () => chrome.runtime.onMessage.removeListener(handler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

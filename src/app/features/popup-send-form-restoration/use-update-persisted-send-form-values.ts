import { useEffect } from 'react';
import { useAsync } from 'react-async-hook';

import { InternalMethods } from '@shared/message-types';
import { getActiveTab } from '@shared/utils/get-active-tab';

import { isPopupMode } from '@app/common/utils';

export function useUpdatePersistedSendFormValues() {
  const activeTab = useAsync(getActiveTab, []).result;

  function onFormStateChange(state: { recipient: string; amount: string | number }) {
    if (!isPopupMode()) return;
    if (!activeTab) return;

    chrome.runtime.sendMessage({
      method: InternalMethods.SetActiveFormState,
      payload: { tabId: activeTab.id, ...state },
    });
  }

  useEffect(
    () => () => {
      if (!isPopupMode()) return;
      if (!activeTab) return;
      chrome.runtime.sendMessage({
        method: InternalMethods.SetActiveFormState,
        payload: { tabId: activeTab.id },
      });
    },
    [activeTab]
  );

  return { onFormStateChange };
}

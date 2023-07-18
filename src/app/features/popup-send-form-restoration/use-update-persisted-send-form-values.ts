import { useEffect } from 'react';
import { useAsync } from 'react-async-hook';

import { getActiveTab } from '@shared/utils/get-active-tab';

import { isPopupMode } from '@app/common/utils';

export function useUpdatePersistedSendFormValues() {
  const activeTab = useAsync(getActiveTab, []).result;

  function onFormStateChange(state: { recipient: string; amount: string | number }) {
    if (!isPopupMode() || !activeTab || !chrome.storage.session) return;
    chrome.storage.session.set({ ['form-state-' + activeTab.id?.toString()]: state });
  }

  useEffect(
    () => () => {
      if (!isPopupMode()) return;
      if (!activeTab) return;
      if (!chrome.storage.session) return;
      chrome.storage.session.remove('form-state-' + activeTab.id?.toString());
    },
    [activeTab]
  );

  return { onFormStateChange };
}

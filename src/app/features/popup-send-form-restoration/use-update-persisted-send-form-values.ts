import { useAsync } from 'react-async-hook';

import { InternalMethods } from '@shared/message-types';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { getActiveTab } from '@shared/utils/get-active-tab';

import { isPopupMode } from '@app/common/utils';

export function useUpdatePersistedSendFormValues() {
  const activeTab = useAsync(getActiveTab, []).result;

  function onFormStateChange(state: BitcoinSendFormValues) {
    if (!isPopupMode()) return;
    if (!activeTab) return;

    chrome.runtime.sendMessage({
      method: InternalMethods.SetActiveFormState,
      payload: { tabId: activeTab.id, ...state },
    });
  }

  return { onFormStateChange };
}
